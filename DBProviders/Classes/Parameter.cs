using DBProviderBase.Enums;
using DBProviderBase.Interfaces;

namespace DBProviderBase.Classes {
    public struct Parameter : IParameter {
        public string ColumnName { get; set; }
        public ParamOperator Operator { get; set; }
        public string DataType { get; set; }
        public string Value { get; set; }

        public string GetFormatedParam() {
            throw new System.NotImplementedException();
        }
    }
}
