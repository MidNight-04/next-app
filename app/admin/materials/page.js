'use client';

import AsideContainer from '../../../components/AsideContainer';
import { SidebarTrigger } from '../../../components/ui/sidebar';
import { Separator } from '../../../components/ui/separator';

const Page = () => {
  return (
    <AsideContainer>
      <div className="flex flex-row justify-between items-center my-5">
        <div className="flex w-full items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-2 hover:bg-primary" />
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4 bg-black"
          />
          <h1 className="font-ubuntu font-bold text-[25px] leading-7 text-nowrap">
            Material List
          </h1>
        </div>
      </div>
    </AsideContainer>
  );
};

export default Page;
