import { lazy } from 'react';

const LazyFolderLocations = lazy(() => import('./folder-locations'));
export default LazyFolderLocations;
