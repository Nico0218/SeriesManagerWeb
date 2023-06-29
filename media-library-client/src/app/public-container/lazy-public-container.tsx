import { lazy } from 'react';

const LazyPublicContainer = lazy(() => import('./public-container'));
export default LazyPublicContainer;
