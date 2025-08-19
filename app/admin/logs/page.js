'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';

import api from '../../../lib/api';
import AsideContainer from '../../../components/AsideContainer';
import { SidebarTrigger } from '../../../components/ui/sidebar';
import { Separator } from '../../../components/ui/separator';
import LogSkeleton from '../../../components/skeletons/LogSkeleton';

const PAGE_SIZE = 10;

const fetchLogs = async ({ pageParam = 1 }) => {
  const res = await api.get(`/log/getall?page=${pageParam}&limit=${PAGE_SIZE}`);
  return {
    logs: res.data?.data || [],
    nextPage: res.data?.nextPage ?? null,
  };
};

const formatDateTime = dateString =>
  new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const Page = () => {
  const router = useRouter();
  const { ref, inView } = useInView();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['logs', PAGE_SIZE],
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    initialPageParam: 1,
    queryFn: fetchLogs,
    getNextPageParam: lastPage => lastPage.nextPage ?? undefined,
    staleTime: 1000 * 60 * 1,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const logs = data?.pages?.flatMap(page => page.logs) || [];

  return (
    <AsideContainer>
      <div className="flex w-full items-center gap-1 lg:gap-2 my-4">
        <SidebarTrigger className="-ml-2 hover:bg-primary" />
        <Separator orientation="vertical" className="h-4 bg-black" />
        <h1 className="font-ubuntu font-bold text-[25px]">Logs</h1>
      </div>

      <section className="my-4">
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <LogSkeleton />
          ) : error ? (
            <div className="text-center text-red-500 font-semibold">
              Error: {error.message}
            </div>
          ) : logs?.length === 0 ? (
            <div className="text-center text-gray-500 font-bold">
              No logs found!
            </div>
          ) : (
            logs.map(log => {
              const url = log.taskId
                ? `/admin/tasks/${log.taskId}`
                : log.siteID
                ? `/admin/projects/${log.siteID}`
                : null;
              return (
                <div
                  key={log._id}
                  className="flex flex-col gap-2 border-b border-gray-200 p-4 bg-white rounded-lg cursor-pointer"
                  onClick={() => router.push(url)}
                >
                  <h2 className="text-sm flex justify-between gap-2">
                    <span className="font-bold flex items-center gap-2">
                      <div className="flex items-center rounded-full overflow-hidden w-6 h-6">
                        <Image
                          src={
                            log.userId?.profileImage ||
                            '/assets/profile-placeholder.png'
                          }
                          alt="profile"
                          width={24}
                          height={24}
                        />
                      </div>
                      {log.userId?.firstname} {log.userId?.lastname}{' '}
                      {log.userId?.employeeId || ''}
                    </span>
                    <span className="text-sm text-gray-500 font-bold">
                      {formatDateTime(log.createdAt)}
                    </span>
                  </h2>
                  <p className="text-sm">{log.log}</p>
                </div>
              );
            })
          )}

          {hasNextPage && <div ref={ref} className="h-10" />}
          {isFetchingNextPage && <LogSkeleton />}
        </div>
      </section>
    </AsideContainer>
  );
};

export default Page;
