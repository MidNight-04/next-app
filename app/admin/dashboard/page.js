import { Suspense } from 'react';
import LoaderSpinner from '../../../components/loader/LoaderSpinner';
import Dashboard from './Content';

const Page = () => {
  return (
    <Suspense fallback={<LoaderSpinner />}>
      <Dashboard />
    </Suspense>
  );
};

export default Page;
