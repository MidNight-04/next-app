'use client';

import { Suspense } from 'react';
import LoaderSpinner from '../../../../components/loader/LoaderSpinner';
import Content from './content';

export default function Page() {
  return (
    <Suspense fallback={<LoaderSpinner />}>
      <Content />
    </Suspense>
  );
}
