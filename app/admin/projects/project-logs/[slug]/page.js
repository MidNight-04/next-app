'use client';

import { useParams, useRouter } from 'next/navigation';
import AsideContainer from '../../../../../components/AsideContainer';
import { SidebarTrigger } from '../../../../../components/ui/sidebar';
import { IoIosArrowBack } from 'react-icons/io';
import { Separator } from '../../../../../components/ui/separator';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import LogSkeleton from '../../../../../components/skeletons/LogSkeleton';
import api from '../../../../../lib/api';
import Image from 'next/image';
import { useEffect } from 'react';

const PAGE_SIZE = 10;

const fetchLogs = async ({ pageParam = 1, slug }) => {
  const res = await api.get(
    `/log/siteid/${slug}?page=${pageParam}&limit=${PAGE_SIZE}`
  );
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
  const { slug } = useParams();
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
    queryKey: ['logs', slug, PAGE_SIZE],
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchLogs({ pageParam, slug }),
    getNextPageParam: lastPage => lastPage.nextPage ?? undefined,
    staleTime: 1000 * 60 * 5,
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
      <div className="flex items-center gap-1 lg:gap-2">
        <SidebarTrigger className="-ml-2 hover:bg-primary" />
        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4 bg-black"
        />
        <IoIosArrowBack
          onClick={() => router.back()}
          className="cursor-pointer transition duration-300 hover:scale-150 ease-in-out"
        />
        <h1 className="font-ubuntu font-semibold text-[25px] leading-7 py-5 whitespace-nowrap">
          Project Logs
        </h1>
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
                : `/admin/projects/${log.siteID}`;
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
