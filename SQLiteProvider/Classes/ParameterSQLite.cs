using DBProviderBase.Classes;
using DBProviderBase.Enums;
using System;

namespace SQLiteProvider.Classes {
    public class ParameterSQLite : IParameter {
        public string ColumnName { get; set; }
        public ParamOperator Operator { get; set; }
        public string DataType { get; set; }
        public string Value { get; set; }

        public string GetFormatedParam() {
            string paramString = $"{ColumnName}";
            switch (Operator) {
                case ParamOperator.Equals:
                    paramString += $" = ";
                    break;
                case ParamOperator.GreaterThan:
                    paramString += $" > ";
                    break;
                case ParamOperator.GreaterEquals:
                    paramString += $" >= ";
                    break;
                case ParamOperator.LessThan:
                    paramString += $" < ";
                    break;
                case ParamOperator.LessEquals:
                    paramString += $" <= ";
                    break;
                case ParamOperator.Like:
                case ParamOperator.Between:
                default:
                    throw new NotImplementedException(Operator.ToString());
            }

            if (DataType.Equals(typeof(int))) {
                paramString += $" {Value}";
            } else {
                paramString += $" \"{Value}\"";
            }

            return paramString;
        }


        public static ParameterSQLite ToParam(IParameter source) {
            ParameterSQLite destination = new ParameterSQLite() {
                ColumnName = source.ColumnName,
                Operator = source.Operator,
                DataType = source.DataType,
                Value = source.Value
            };
            return destination;
        }
    }
}
