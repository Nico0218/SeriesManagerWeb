using DBProviderBase.Classes;
using DBProviderBase.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;

namespace MySQLProvider.Services {
    public sealed class MySqlDataClient : IDataService, IDisposable {
        private const string msgErrorOnFetchData = "Failed to get data for object";
        private const string msgErrorOnConnectionTest = "Connection test failed";
        private readonly ILogger<MySqlDataClient> logger;
        private readonly IOptions<ConnectionSettings> connectionSettings;
        private readonly MySqlConnection mySqlConnection;

        public MySqlDataClient(ILogger<MySqlDataClient> logger, IOptions<ConnectionSettings> connectionSettings) {
            logger.LogDebug("Initializing MySql Client");
            if (connectionSettings == null || connectionSettings.Value == null) { 
                logger.LogError("No database connection details provided.");
                throw new NullReferenceException("Database connection settings.");
            }
            this.logger = logger;
            this.connectionSettings = connectionSettings;

            MySqlConnectionStringBuilder mySqlConnectionStringBuilder = new MySqlConnectionStringBuilder(connectionSettings.Value.ConnectionString) {
                UserID = connectionSettings.Value.UserName,
                Password = connectionSettings.Value.Password
            };
            mySqlConnectionStringBuilder.Database = connectionSettings.Value.DBName;
            mySqlConnection = new MySqlConnection(mySqlConnectionStringBuilder.GetConnectionString(true));
            logger.LogDebug("Initialized MySql Client");
        }

        public void Dispose() {
            mySqlConnection.Dispose();
        }

        public void TestConnection() {
            try {
                mySqlConnection.Open();
                mySqlConnection.Close();
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
            using (MySqlCommand cmd = mySqlConnection.CreateCommand()) {
                cmd.CommandText = "SHOW TABLES;";
                mySqlConnection.Open();
                using (MySqlDataReader tableReader = cmd.ExecuteReader()) {
                    while (tableReader.Read() && !tableExist) {
                        if (tableReader.GetString($"Tables_in_{connectionSettings.Value.DBName}") == obj.GetType().Name.ToLower()) {
                            tableExist = true;
                        }
                    }
                }
                mySqlConnection.Close();
            }
            //The table exist and we just need to modify it
            if (tableExist) {
                DataTable schemaTable;
                using (MySqlCommand cmd = mySqlConnection.CreateCommand()) {
                    cmd.CommandText = $"SELECT * FROM {tableName};";
                    mySqlConnection.Open();
                    using (MySqlDataReader tableReader = cmd.ExecuteReader()) {
                        schemaTable = tableReader.GetSchemaTable();
                    }
                    mySqlConnection.Close();
                }

                StringBuilder quertyStringBuilder = new StringBuilder();
                quertyStringBuilder.AppendLine($"ALTER TABLE {tableName} ");

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
                foreach (KeyValuePair<PropertyInfo, DataRow> columnSet in columnSets) {
                    if (columnSet.Value == null) {
                        //We don`t have this column lets create it
                        quertyStringBuilder.AppendLine(BuildColumnAddString(columnSet.Key));
                        hasModification = true;
                    } else {
                        //WE have to modify an existing column
                        string afterColumn = columnSet.Value["ColumnName"].ToString();
                        string newColumnName = columnSet.Key.Name;
                        string dataType = GetMySQLDataType(columnSet.Key);
                        if ((afterColumn != newColumnName) || (columnSet.Value["DataType"].ToString() != columnSet.Key.PropertyType.ToString())
                            || columnSet.Value["ColumnSize"].ToString() != GetFieldSize(columnSet.Key).ToString()) {
                            quertyStringBuilder.AppendLine($"CHANGE COLUMN `{afterColumn}` `{newColumnName}` {dataType} NULL DEFAULT NULL ;");
                            hasModification = true;
                        }
                    }
                }
                if (hasModification) {
                    using (MySqlCommand alterCmd = mySqlConnection.CreateCommand()) {
                        alterCmd.CommandText = quertyStringBuilder.ToString();
                        mySqlConnection.Open();
                        try {
                            alterCmd.ExecuteNonQuery();
                        } catch (Exception ex) {
                            logger.LogError($"Failed to alter table - {tableName}", ex);
                            throw;
                        } finally {
                            mySqlConnection.Close();
                        }
                    }
                }
            }
            //Create the new table
            else {
                StringBuilder quertyStringBuilder = new StringBuilder();
                quertyStringBuilder.AppendLine($"CREATE TABLE {tableName} (");
                foreach (PropertyInfo propertyInfo in obj.GetType().GetProperties()) {
                    quertyStringBuilder.AppendLine(BuildColumnAddString(propertyInfo));
                }
                quertyStringBuilder.AppendLine($"PRIMARY KEY (`ID`));");

                using (MySqlCommand createCmd = mySqlConnection.CreateCommand()) {
                    createCmd.CommandText = quertyStringBuilder.ToString();
                    mySqlConnection.Open();
                    try {
                        createCmd.ExecuteNonQuery();
                    } catch (Exception ex) {
                        logger.LogError($"Failed to create new table - {tableName}", ex);
                        throw;
                    }
                    mySqlConnection.Close();
                }
            }
        }

        public void DeleteObjectData<T>(T[] objects) {
            if (objects is null) {
                throw new ArgumentNullException(nameof(objects));
            }
            StringBuilder deleteStringBuilder = new StringBuilder();
            string tableName = GetTableName(objects[0]);
            deleteStringBuilder.AppendLine("SET SQL_SAFE_UPDATES=0;");
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
            deleteStringBuilder.AppendLine("SET SQL_SAFE_UPDATES=1;");

            using (MySqlCommand deleteCmd = mySqlConnection.CreateCommand()) {
                deleteCmd.CommandText = deleteStringBuilder.ToString();
                mySqlConnection.Open();
                try {
                    int rowsAffected = deleteCmd.ExecuteNonQuery();
                    logger.LogInformation($"Deleted {rowsAffected} items from {tableName}");
                } catch (Exception ex) {
                    logger.LogError($"Failed to delete data from {tableName}", ex);
                    throw;
                } finally {
                    mySqlConnection.Close();
                }
            }
        }

        public List<T> GetObjectData<T>(List<IParameter> parameters) {
            try {
                T obj = (T)Activator.CreateInstance(typeof(T));
                using (MySqlCommand selectCmd = mySqlConnection.CreateCommand()) {
                    string tableName = GetTableName(obj);
                    selectCmd.CommandText = $"SELECT * FROM {tableName}";
                    if (parameters != null && parameters.Count > 0) {
                        //TODO
                    }
                    mySqlConnection.Open();
                    List<T> results = new List<T>();
                    try {
                        using (MySqlDataReader result = selectCmd.ExecuteReader()) {
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
                        return results;
                    } finally {
                        mySqlConnection.Close();
                    }
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
                    valuesString.AppendLine($"\"{properties[i].GetValue(obj).ToString()}\"");
                } else if (properties[i].PropertyType == typeof(int)) {
                    valuesString.AppendLine($"{properties[i].GetValue(obj).ToString()}");
                } else {
                    valuesString.AppendLine($"\"{properties[i].GetValue(obj).ToString()}\"");
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

            using (MySqlCommand insertCmd = mySqlConnection.CreateCommand()) {
                insertCmd.CommandText = insertStringBuilder.ToString();
                mySqlConnection.Open();
                try {
                    insertCmd.ExecuteNonQuery();
                } catch (Exception ex) {
                    logger.LogError($"Faield to insert data into {tableName}", ex);
                    throw;
                } finally {
                    mySqlConnection.Close();
                }
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

            updateStringBuilder.AppendLine($"WHERE `ID` = \"{obj.GetType().GetProperty("ID").GetValue(obj).ToString()}\"");

            using (MySqlCommand deleteCmd = mySqlConnection.CreateCommand()) {
                deleteCmd.CommandText = updateStringBuilder.ToString();
                mySqlConnection.Open();
                try {
                    deleteCmd.ExecuteNonQuery();
                } catch (Exception ex) {
                    logger.LogError($"Failed to update data in {tableName}", ex);
                    throw;
                } finally {
                    mySqlConnection.Close();
                }
            }
        }

        private string GetTableName<T>(T obj) => $"`{connectionSettings.Value.DBName}`.`{obj.GetType().Name.ToLower()}`";

        private string BuildColumnAddString(PropertyInfo propertyInfo) {
            StringBuilder stringBuilder = new StringBuilder();
            string dataType = GetMySQLDataType(propertyInfo);

            if (propertyInfo.Name != "ID")
                stringBuilder.AppendLine($"`{propertyInfo.Name}` {dataType} NULL,");
            else
                stringBuilder.AppendLine($"`{propertyInfo.Name}` {dataType} NOT NULL,");
            return stringBuilder.ToString();
        }

        private string GetMySQLDataType(PropertyInfo propertyInfo) {
            string mySqlDataType;
            if (propertyInfo.PropertyType == typeof(string)) {
                mySqlDataType = $"VARCHAR";
            } else if (propertyInfo.PropertyType == typeof(int)) {
                mySqlDataType = "INT";
            } else {
                mySqlDataType = "VARCHAR";
            }

            if (mySqlDataType.Equals("VARCHAR")) {
                mySqlDataType = $"VARCHAR({GetFieldSize(propertyInfo)})";
            }
            return mySqlDataType;
        }

        private int GetFieldSize(PropertyInfo propertyInfo) {
            int MaxLength = 250;
            var attribute = propertyInfo.GetCustomAttributes().FirstOrDefault();
            if (attribute != null)
                MaxLength = (attribute as StringValidatorAttribute).MaxLength;
            return MaxLength;
        }
    }
}
