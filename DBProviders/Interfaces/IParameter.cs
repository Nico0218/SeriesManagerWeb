using DBProviderBase.Enums;

namespace DBProviderBase.Interfaces
{
    public interface IParameter {
        string ColumnName { get; set; }
        ParamOperator Operator { get; set; }
        string DataType { get; set; }
        string Value { get; set; }
        string GetFormatedParam();
    }
}
