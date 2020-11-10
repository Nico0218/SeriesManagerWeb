using DBProviderBase.Classes;
using DBProviderBase.Interfaces;
using MediaLibraryCommon.Classes.LogicModels;
using MediaLibraryServer.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace MediaLibraryServer.Services {
    public abstract class AbstractLibraryService<TObject, TDataObject> : IAbstractLibraryService<TObject, TDataObject> {
        internal readonly ILogger logger;
        internal readonly IDataService dataService;
        public const string ConvertMethod = "op_Explicit";
        private Type businessType;
        private Type dataType;

        public AbstractLibraryService(ILogger logger, IDataService dataService) {
            this.logger = logger;
            this.dataService = dataService;
            businessType = typeof(TObject);
            dataType = typeof(TDataObject);
        }

        public virtual List<TObject> GetAll() {
            logger.LogInformation($"Getting all {businessType.Name}s.");
            List<TDataObject> objectDatas = dataService.GetObjectData<TDataObject>();
            List<TObject> objects = new List<TObject>();
            MethodInfo convertMeth = typeof(TDataObject).GetMethod(ConvertMethod, new Type[1] { dataType });
            if (convertMeth == null)
                throw new NotImplementedException(ConvertMethod);
            foreach (var item in objectDatas) {
                TObject obj = (TObject)getConvertMethod(dataType).Invoke(item, new object[1] { item });
                objects.Add(obj);
            }
            logger.LogInformation($"Returning {objects.Count} {businessType.Name}s.");
            return objects;
        }

        public virtual TObject GetByID(string ID) {
            if (ID is null) {
                throw new ArgumentNullException(nameof(ID));
            }

            logger.LogInformation($"Getting {businessType.Name} with ID {ID}");
            List<IParameter> paramerters = new List<IParameter>();
            paramerters.Add(new Parameter() {
                ColumnName = "ID",
                DataType = "System.String",
                Operator = DBProviderBase.Enums.ParamOperator.Equals,
                Value = ID
            });
            TDataObject imageData = dataService.GetObjectData<TDataObject>(paramerters).FirstOrDefault();
            if (imageData != null) {
                logger.LogInformation($"Returning {businessType.Name} with ID {ID}");
                return (TObject)getConvertMethod(dataType).Invoke(imageData, new object[1] { imageData });
            } else {
                logger.LogInformation($"Could not find {businessType.Name} with ID {ID}");
                return default;
            }
        }

        public virtual void Save(TObject logicObject) {
            if (logicObject is null) {
                throw new ArgumentNullException($"No {businessType.Name} provided to save.");
            }
            logger.LogInformation($"Saving new {businessType.Name}");
            TDataObject dataObject = (TDataObject)getConvertMethod(businessType).Invoke(logicObject, new object[1] { logicObject });
            switch ((logicObject as LogicModelBase).Status) {
                case MediaLibraryCommon.Enums.ObjectStatus.Created:
                    dataService.InsertObjectData(dataObject);
                    break;
                case MediaLibraryCommon.Enums.ObjectStatus.Modified:
                    dataService.UpdateObjectData(dataObject);
                    break;
                case MediaLibraryCommon.Enums.ObjectStatus.Deleted:
                    TDataObject[] dataObjects = new TDataObject[1];
                    dataObjects[0] = dataObject;
                    dataService.DeleteObjectData(dataObjects);
                    break;
                case MediaLibraryCommon.Enums.ObjectStatus.None:
                default:
                    break;
            }
            
        }

        private MethodInfo getConvertMethod(Type type) {
            MethodInfo convertMeth = typeof(TDataObject).GetMethod(ConvertMethod, new Type[1] { type });
            if (convertMeth == null)
                throw new NotImplementedException(ConvertMethod);
            return convertMeth;
        }
    }
}
