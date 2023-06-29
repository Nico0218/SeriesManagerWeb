import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import LoadingComponent from '../custom-components/loading-component/loading-component';

export default function PrivateContainer() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <Outlet />
    </Suspense>
  );
}
