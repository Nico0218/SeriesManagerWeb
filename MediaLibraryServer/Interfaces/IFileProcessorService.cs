﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MediaLibraryServer.Interfaces
{
    public interface IFileProcessorService {
        public void Start();
        void Dispose();
    }
}
