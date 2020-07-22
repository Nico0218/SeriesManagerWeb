using DBProviderBase.Classes;
using MediaLibraryServer.Interfaces;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SQLiteProvider.Classes;
using System;
using System.Collections.Generic;
using System.Data;
using System.Reflection;
using System.Text;

namespace SQLiteProvider.Services {
    public class SQLiteClient : IDataService, IDisposable {
        private const string msgErrorOnFetchData = "Failed to get data for object";
        private const string msgErrorOnConnectionTest = "Connection test failed";
        private readonly ILogger<SQLiteClient> logger;
        private readonly IOptions<ConnectionSettings> connectionSettings;
        //SQlite expects new connection for every action
        private readonly string ConnectionString;

        public SQLiteClient(ILogger<SQLiteClient> logger, IOptions<ConnectionSettings> connectionSettings) {
            logger.LogDebug("Initializing SQLite Client");
            if (connectionSettings == null || connectionSettings.Value == null) {
                logger.LogError("No database connection details provided.");
                throw new NullReferenceException("Database connection settings.");
            }
            this.logger = logger;
            this.connectionSettings = connectionSettings;
            SqliteConnectionStringBuilder sqliteConnectionStringBuilder = new SqliteConnectionStringBuilder();
            sqliteConnectionStringBuilder.DataSource = connectionSettings.Value.DBName + ".db";
            sqliteConnectionStringBuilder.Cache = SqliteCacheMode.Default;
            sqliteConnectionStringBuilder.Mode = SqliteOpenMode.ReadWriteCreate;
            //sqliteConnectionStringBuilder.Password = connectionSettings.Value.Password;

            ConnectionString = sqliteConnectionStringBuilder.ConnectionString;

            logger.LogDebug("Initialized SQLite Client");
        }

        public void Dispose() {
            //sqliteConnection.Dispose();
        }

        public void TestConnection() {
            try {
                using (SqliteConnection sqliteConnection = new SqliteConnection(ConnectionString)) {
                    sqliteConnection.Open();
                    sqliteConnection.Close();
                }
            } catch (Exception ex) {
                logger.LogError(msgErrorOnConnectionTest, ex);
                throw;
            }
        }

        public void CreatOrAlterObjectTable<T>() {
            T obj = (T)Activator.CreateInstance(typeof(T));
            string tableName = GetTableName(obj);

            //Get list of tables and check if it exists
            bool tableExist = false;
            using (SqliteConnection sqliteConnection = new SqliteConnection(ConnectionString)) {
                using (SqliteCommand cmd = sqliteConnection.CreateCommand()) {
                    cmd.CommandText = $"SELECT name FROM sqlite_master WHERE type='table';";
                    sqliteConnection.Open();
                    using (SqliteDataReader tableReader = cmd.ExecuteReader()) {
                        while (tableReader.Read() && !tableExist) {
                            //Should probably cache this
                            if (tableReader.GetString("name").Equals(obj.GetType().Name.ToLower(), StringComparison.OrdinalIgnoreCase)) {
                                tableExist = true;
                                break;
                            }
                        }
                    }
                    sqliteConnection.Close();
                }
            }
            //The table exist and we just need to modify it
            if (tableExist) {
                //SQLLite does not have alter column functionality so we have to do some magic
                DataTable schemaTable;
                using (SqliteConnection sqliteConnection = new SqliteConnection(ConnectionString)) {
                    using (SqliteCommand cmd = sqliteConnection.CreateCommand()) {
                        cmd.CommandText = $"SELECT * FROM {tableName};";
                        sqliteConnection.Open();
                        using (SqliteDataReader tableReader = cmd.ExecuteReader()) {
                            schemaTable = tableReader.GetSchemaTable();
                        }
                    }
                    sqliteConnection.Close();
                }

                if (schemaTable == null)
                    throw new Exception($"Failed to get table schema for table {tableName}");

                Dictionary<PropertyInfo, DataRow> columnSets = new Dictionary<PropertyInfo, DataRow>();

                foreach (PropertyInfo propertyInfo in obj.GetType().GetProperties()) {
                    bool colExisit = false;
                    for (int i = 0; i < schemaTable.Rows.Count; i++) {
                        if (propertyInfo.Name == schemaTable.Rows[i]["ColumnName"].ToString()) {
                            columnSets.Add(propertyInfo, schemaTable.Rows[i]);
                            colExisit = true;
                            break;
                        }
                    }
                    if (!colExisit)
                        columnSets.Add(propertyInfo, null);
                }


                bool hasModification = false;
                //Just check if we have any change
                foreach (KeyValuePair<PropertyInfo, DataRow> columnSet in columnSets) {
                    if (columnSet.Value == null) {
                        //We don`t have this column lets update
                        hasModification = true;
                        break;
                    } else {
                        //WE have to modify an existing column
                        //DataRow Index 0 = "ColumnName"
                        //DataRow Index 13 = "DataType"
                        string dataType = GetSQLiteDataType(columnSet.Key);
                        if ((columnSet.Value[0].ToString() != columnSet.Key.Name) || (columnSet.Value[13].ToString() != dataType)) {
                            if (columnSet.Value[13].ToString() != "TEXT") {

                                throw new NotImplementedException();
                            }
                            hasModification = true;
                            break;
                        }
                    }
                }
                if (hasModification) {
                    using (SqliteConnection sqliteConnection = new SqliteConnection(ConnectionString)) {
                        sqliteConnection.Open();
                        string oldTableName = GetTableName(obj, "old");
                        using (SqliteTransaction sqliteTransaction = sqliteConnection.BeginTransaction()) {
                            try {
                                //Rename the existing table
                                ExecuteNonQuery($"ALTER TABLE {tableName} RENAME TO {oldTableName}", sqliteConnection);
                                sqliteTransaction.Commit();
                            } catch (Exception ex) {
                                logger.LogError("CreateAlterTable event failed.", ex);
                                sqliteTransaction.Rollback();
                                throw;
                            }
                        }

                        using (SqliteTransaction sqliteTransaction = sqliteConnection.BeginTransaction()) {
                            try {
                                //Create the new table
                                CreateNewTable<T>(obj, tableName, false);
                                //Copy data from old table to new table
                                string insertPart = $"INSERT INTO {tableName} (";
                                string selectPart = $"SELECT ";
                                foreach (KeyValuePair<PropertyInfo, DataRow> columnSet in columnSets) {
                                    if (columnSet.Value != null && columnSet.Key != null) {
                                        insertPart += $"{columnSet.Key.Name}, ";
                                        selectPart += $"{columnSet.Value["ColumnName"]}, ";
                                    }
                                }
                                insertPart = insertPart.Substring(0, insertPart.Length - 2) + ")";
                                selectPart = selectPart.Substring(0, selectPart.Length - 2) + $" FROM {oldTableName}";
                                ExecuteNonQuery($"{insertPart} {selectPart}", sqliteConnection);

                                //Delete old table
                                ExecuteNonQuery($"DROP TABLE {oldTableName}", sqliteConnection);
                            } catch (Exception ex) {
                                logger.LogError("CreateAlterTable event failed.", ex);
                                sqliteTransaction.Rollback();
                                using (SqliteTransaction rollbackTransaction = sqliteConnection.BeginTransaction()) {
                                    try {
                                        //Rename the existing table
                                        ExecuteNonQuery($"ALTER TABLE {oldTableName} RENAME TO {tableName}", sqliteConnection);
                                        rollbackTransaction.Commit();
                                    } catch (Exception ex2) {
                                        logger.LogError("CreateAlterTable event failed.", ex2);
                                        rollbackTransaction.Rollback();
                                        throw;
                                    }
                                }
                            }
                        }
                        sqliteConnection.Close();
                    }
                }
            }
            //Create the new table
            else {
                CreateNewTable<T>(obj, tableName, true);
            }
        }

        public void DeleteObjectData<T>(T[] objects) {
            if (objects is null) {
                throw new ArgumentNullException(nameof(objects));
            }
            StringBuilder deleteStringBuilder = new StringBuilder();
            string tableName = GetTableName(objects[0]);
            deleteStringBuilder.AppendLine($"DELETE FROM {tableName}");
            deleteStringBuilder.AppendLine("WHERE `ID` IN (");
            for (int i = 0; i < objects.Length; i++) {
                deleteStringBuilder.AppendLine($"\"{objects[i].GetType().GetProperty("ID").GetValue(objects[i]).ToString()}\"");
                if (i != objects.Length - 1) {
                    deleteStringBuilder.Append(", ");
                } else {
                    deleteStringBuilder.Append(");");
                }
            }

            using (SqliteConnection sqliteConnection = new SqliteConnection(ConnectionString)) {
                sqliteConnection.Open();
                int rowsAffected = ExecuteNonQuery(deleteStringBuilder.ToString(), sqliteConnection);
                sqliteConnection.Close();
                logger.LogInformation($"Deleted {rowsAffected} items from {tableName}");
            }
        }

        public List<T> GetObjectData<T>(List<IParameter> parameters) {
            try {
                T obj = (T)Activator.CreateInstance(typeof(T));
                using (SqliteConnection sqliteConnection = new SqliteConnection(ConnectionString)) {
                    List<T> results = new List<T>();
                    using (SqliteCommand selectCmd = sqliteConnection.CreateCommand()) {
                        string tableName = GetTableName(obj);
                        selectCmd.CommandText = $"SELECT * FROM {tableName}";
                        if (parameters != null && parameters.Count > 0) {
                            string whereClause = "";
                            for (int i = 0; i < parameters.Count; i++) {
                                ParameterSQLite parameterSQLite = ParameterSQLite.ToParam(parameters[i]);
                                if (!string.IsNullOrWhiteSpace(whereClause))
                                    whereClause += " AND ";
                                else
                                    whereClause = "WHERE ";
                                whereClause += parameterSQLite.GetFormatedParam();
                            }
                            selectCmd.CommandText += whereClause;
                        }
                        sqliteConnection.Open();

                        using (SqliteDataReader result = selectCmd.ExecuteReader()) {
                            while (result.Read()) {
                                obj = (T)Activator.CreateInstance(typeof(T));
                                foreach (PropertyInfo propertyInfo in obj.GetType().GetProperties()) {
                                    if (propertyInfo.PropertyType == typeof(string)) {
                                        propertyInfo.SetValue(obj, result.GetString(propertyInfo.Name));
                                    }
                                }
                                results.Add(obj);
                            }
                        }
                    }
                    sqliteConnection.Close();
                    return results;
                }
            } catch (Exception ex) {
                logger.LogError(msgErrorOnFetchData, ex);
                throw;
            }
        }

        public void InsertObjectData<T>(T obj) {
            StringBuilder insertStringBuilder = new StringBuilder();
            StringBuilder valuesString = new StringBuilder();
            string tableName = GetTableName(obj);
            insertStringBuilder.AppendLine($"INSERT INTO {tableName} (");

            PropertyInfo[] properties = obj.GetType().GetProperties();
            for (int i = 0; i < properties.Length; i++) {
                insertStringBuilder.AppendLine($"`{properties[i].Name}`");


                if (properties[i].PropertyType == typeof(string)) {
                    valuesString.AppendLine($"\"{properties[i].GetValue(obj)}\"");
                } else if (properties[i].PropertyType == typeof(int)) {
                    valuesString.AppendLine($"{properties[i].GetValue(obj)}");
                } else {
                    valuesString.AppendLine($"\"{properties[i].GetValue(obj)}\"");
                }

                if (i != properties.Length - 1) {
                    insertStringBuilder.Append(",");
                    valuesString.Append(",");
                } else {
                    insertStringBuilder.Append(") VALUES (");
                    valuesString.Append(");");
                }
            }
            insertStringBuilder.AppendLine(valuesString.ToString());

            using (SqliteConnection sqliteConnection = new SqliteConnection(ConnectionString)) {
                sqliteConnection.Open();
                ExecuteNonQuery(insertStringBuilder.ToString(), sqliteConnection);
                sqliteConnection.Close();
            }
        }

        public void UpdateObjectData<T>(T obj) {
            if (obj is null) {
                throw new ArgumentNullException(nameof(obj));
            }
            StringBuilder updateStringBuilder = new StringBuilder();
            string tableName = GetTableName(obj);
            updateStringBuilder.AppendLine($"UPDATE {tableName} SET");

            PropertyInfo[] properties = obj.GetType().GetProperties();
            for (int i = 0; i < properties.Length; i++) {
                string value;
                if (properties[i].PropertyType == typeof(string)) {
                    value = $"\"{properties[i].GetValue(obj)}\"";
                } else if (properties[i].PropertyType == typeof(int)) {
                    value = $"{properties[i].GetValue(obj)}";
                } else {
                    value = $"`{properties[i].GetValue(obj)}`";
                }
                updateStringBuilder.AppendLine($"`{properties[i].Name}` = {value}");
                if (i != properties.Length - 1) {
                    updateStringBuilder.Append(",");
                }
            }

            updateStringBuilder.AppendLine($"WHERE `ID` = \"{obj.GetType().GetProperty("ID").GetValue(obj)}\"");

            using (SqliteConnection sqliteConnection = new SqliteConnection(ConnectionString)) {
                sqliteConnection.Open();
                ExecuteNonQuery(updateStringBuilder.ToString(), sqliteConnection);
                sqliteConnection.Close();
            }
        }

        private string GetTableName<T>(T obj, string prefix = "") => $"`{prefix + obj.GetType().Name.ToLower()}`";

        private string BuildColumnAddString(PropertyInfo propertyInfo) {
            StringBuilder stringBuilder = new StringBuilder();
            string dataType = GetSQLiteDataType(propertyInfo);

            if (propertyInfo.Name != "ID")
                stringBuilder.AppendLine($"`{propertyInfo.Name}` {dataType} NULL,");
            else
                stringBuilder.AppendLine($"`{propertyInfo.Name}` {dataType} NOT NULL,");
            return stringBuilder.ToString();
        }

        private string GetSQLiteDataType(PropertyInfo propertyInfo) {
            string mySqlDataType;
            if (propertyInfo.PropertyType == typeof(string) || propertyInfo.PropertyType == typeof(DateTime)) {
                mySqlDataType = $"TEXT";
            } else if (propertyInfo.PropertyType == typeof(int)) {
                mySqlDataType = "INTEGER";
            } else if (propertyInfo.PropertyType == typeof(float)) {
                mySqlDataType = "REAL";
            } else {
                mySqlDataType = "BLOB";
            }

            //SQL Lite does not care about field sizes
            //if (!mySqlDataType.Equals("TEXT")) {
            //    mySqlDataType = $"{mySqlDataType}({GetFieldSize(propertyInfo)})";
            //}
            return mySqlDataType;
        }

        //private int GetFieldSize(PropertyInfo propertyInfo) {
        //    int MaxLength = 250;
        //    var attribute = propertyInfo.GetCustomAttributes().FirstOrDefault();
        //    if (attribute != null)
        //        MaxLength = (attribute as StringValidatorAttribute).MaxLength;
        //    return MaxLength;
        //}

        private void CreateNewTable<T>(T obj, string tableName, bool manageConnection) {
            StringBuilder quertyStringBuilder = new StringBuilder();
            quertyStringBuilder.AppendLine($"CREATE TABLE {tableName} (");
            foreach (PropertyInfo propertyInfo in obj.GetType().GetProperties()) {
                quertyStringBuilder.AppendLine(BuildColumnAddString(propertyInfo));
            }
            quertyStringBuilder.AppendLine($"PRIMARY KEY (`ID`));");

            using (SqliteConnection sqliteConnection = new SqliteConnection(ConnectionString)) {
                sqliteConnection.Open();
                ExecuteNonQuery(quertyStringBuilder.ToString(), sqliteConnection);
                sqliteConnection.Close();
            }
        }

        private int ExecuteNonQuery(string statement, SqliteConnection sqliteConnection = null) {
            int rowsAffected = 0;
            if (sqliteConnection == null) {
                using (sqliteConnection = new SqliteConnection(ConnectionString)) {
                    sqliteConnection.Open();
                    using (SqliteCommand alterCmd = sqliteConnection.CreateCommand()) {
                        alterCmd.CommandText = statement;
                        try {
                            rowsAffected = alterCmd.ExecuteNonQuery();
                        } catch (Exception ex) {
                            throw new Exception($"Failed to execute non query", ex);
                        }
                    }
                    sqliteConnection.Close();
                }
            } else {
                using (SqliteCommand alterCmd = sqliteConnection.CreateCommand()) {
                    alterCmd.CommandText = statement;
                    try {
                        rowsAffected = alterCmd.ExecuteNonQuery();
                    } catch (Exception ex) {
                        throw new Exception($"Failed to execute non query", ex);
                    }
                }
            }
            return rowsAffected;
        }
    }
}
