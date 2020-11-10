using MediaLibraryCommon.Enums;
using System;
using System.Configuration;

namespace MediaLibraryCommon.Classes.LogicModels {
    public abstract class LogicModelBase : ILogicModelBase {
        [StringValidator(MaxLength = 36)]
        public string ID { get; set; }

        [StringValidator(MaxLength = 250)]
        public string Name { get; set; }

        [StringValidator(MaxLength = 250)]
        public string DisplayName { get; set; }

        public ObjectStatus Status { get; set; } = ObjectStatus.None;

        public LogicModelBase() {
            ID = Guid.NewGuid().ToString();
        }

        public LogicModelBase(string name) {
            ID = Guid.NewGuid().ToString();
            if (!string.IsNullOrEmpty(name)) {
                Name = name.Replace(" ", "");
                DisplayName = name;
            }
        }
    }
}
