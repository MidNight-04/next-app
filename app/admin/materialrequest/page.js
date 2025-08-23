'use client';
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { useRouter } from 'next/navigation';
import { Add, Search, FilterList, Refresh, Error } from '@mui/icons-material';
import { useInfiniteQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';

import AsideContainer from '../../../components/AsideContainer';
import { SidebarTrigger } from '../../../components/ui/sidebar';
import { Separator } from '../../../components/ui/separator';
import { Input } from '../../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import api from '../../../lib/api';
import MaterialRequestSkeleton from '../../../components/skeletons/MaterialRequestSkeleton';
import TableCard from '../../../components/MaterialRequest/TableCard';

const ITEMS_PER_PAGE = 20;
const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'partial', label: 'Partial' },
  { value: 'completed', label: 'Completed' },
];

const Page = () => {
  const router = useRouter();
  const loadMoreRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce search query
  const debouncedSetSearch = useCallback(
    debounce(query => {
      setDebouncedSearchQuery(query);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSetSearch(searchQuery);
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [searchQuery, debouncedSetSearch]);

  const queryKey = useMemo(
    () => ['materialrequest', debouncedSearchQuery, statusFilter],
    [debouncedSearchQuery, statusFilter]
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      const params = {
        page: pageParam,
        limit: ITEMS_PER_PAGE,
        ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
      };

      try {
        const res = await api.get('/materialrequest/getallrequest', { params });
        return res.data;
      } catch (error) {
        console.error('Failed to fetch material requests:', error);
        throw new Error('Failed to load material requests. Please try again.');
      }
    },
    getNextPageParam: lastPage => {
      if (!lastPage?.meta) return undefined;
      return lastPage.meta.page < lastPage.meta.totalPages
        ? lastPage.meta.page + 1
        : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Infinite scroll observer with improved performance
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || isLoading) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    const el = loadMoreRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) {
        observer.unobserve(el);
      }
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, isLoading]);

  // Optimized mapping function with memoization
  const mapData = useCallback((orderedMaterials, receivedMaterials) => {
    if (!orderedMaterials?.length) return [];

    const receivedMap = new Map();

    if (receivedMaterials?.length) {
      for (const rec of receivedMaterials) {
        const id = rec.material?._id;
        if (id) {
          if (!receivedMap.has(id)) {
            receivedMap.set(id, []);
          }
          receivedMap.get(id).push(rec);
        }
      }
    }

    return orderedMaterials.map(order => {
      const received = receivedMap.get(order.material?._id) || [];
      const totalReceivedQty = received.reduce(
        (sum, r) => sum + (Number(r.quantity) || 0),
        0
      );

      let status = 'Pending';
      const orderQty = Number(order.quantity) || 0;

      if (totalReceivedQty > 0 && totalReceivedQty < orderQty) {
        status = 'Partial';
      } else if (totalReceivedQty >= orderQty) {
        status = 'Completed';
      }

      return {
        order,
        received,
        totalReceivedQty,
        status,
      };
    });
  }, []);

  const handleCreateRequest = useCallback(() => {
    router.push('/admin/materialrequest/creatematerialrequest');
  }, [router]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('all');
  }, []);

  // Calculate total results
  const totalResults = data?.pages[0]?.meta?.total || 0;
  const hasFilters = debouncedSearchQuery || statusFilter !== 'all';

  // Error state
  if (error && !data) {
    return (
      <AsideContainer>
        <div className="flex flex-col justify-between items-center my-5">
          <div className="flex w-full items-center gap-1 lg:gap-2 mb-6">
            <SidebarTrigger className="-ml-2 hover:bg-primary" />
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-4 bg-black"
            />
            <h1 className="font-ubuntu font-bold text-[25px] leading-7 text-nowrap">
              Material Request
            </h1>
          </div>

          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Error className="w-16 h-16 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-700">
              Failed to Load Material Requests
            </h2>
            <p className="text-gray-500 text-center max-w-md">
              {error.message ||
                'An unexpected error occurred while loading material requests.'}
            </p>
            <Button onClick={handleRefresh} className="flex items-center gap-2">
              <Refresh />
              Try Again
            </Button>
          </div>
        </div>
      </AsideContainer>
    );
  }

  return (
    <AsideContainer>
      <div className="flex flex-col justify-between items-center my-5">
        {/* Header */}
        <div className="flex w-full items-center gap-1 lg:gap-2 mb-6">
          <SidebarTrigger className="-ml-2 hover:bg-primary" />
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4 bg-black"
          />
          <h1 className="font-ubuntu font-bold text-[25px] leading-7 text-nowrap -lg:text-xl">
            Material Request
          </h1>

          <div className="ml-auto flex items-center gap-2 -md:[&_span]:hidden">
            <Button
              onClick={handleRefresh}
              disabled={isRefetching}
              className="bg-secondary text-primary px-3 py-1.5 rounded-full flex items-center gap-2 hover:opacity-90 hover:text-secondary transition-opacity"
            >
              <Refresh
                className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`}
              />
              <span>Refresh</span>
            </Button>

            <Button
              onClick={handleCreateRequest}
              className="bg-secondary text-primary px-4 py-2 rounded-full flex items-center gap-2 hover:opacity-90 hover:text-secondary transition-opacity"
            >
              <Add />
              Create Request
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="w-full mb-6 space-y-4">
          <div className="flex sm:flex-row gap-4 items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search material requests..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <FilterList className="w-4 h-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>
                {totalResults > 0 ? (
                  <>
                    Showing {totalResults} result{totalResults !== 1 ? 's' : ''}
                  </>
                ) : (
                  'No results found'
                )}
              </span>
              {hasFilters && (
                <Badge variant="secondary" className="text-xs">
                  Filtered
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div
            className="w-full space-y-4"
            aria-label="Loading material requests"
          >
            {[...Array(3)].map((_, i) => (
              <MaterialRequestSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        ) : data?.pages?.[0]?.data?.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700">
              {hasFilters
                ? 'No matching requests found'
                : 'No material requests yet'}
            </h2>
            <p className="text-gray-500 text-center max-w-md">
              {hasFilters
                ? "Try adjusting your search criteria or filters to find what you're looking for."
                : 'Get started by creating your first material request.'}
            </p>
            {hasFilters ? (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            ) : (
              <Button
                onClick={handleCreateRequest}
                className="flex items-center gap-2"
              >
                <Add />
                Create Your First Request
              </Button>
            )}
          </div>
        ) : (
          <div className="w-full space-y-4">
            {data?.pages.map((page, pageIndex) => (
              <div key={`page-${pageIndex}`} className="space-y-4">
                {page.data?.map(item => {
                  const mappedMaterials = mapData(
                    item.materials,
                    item.receivedItems
                  );
                  return (
                    <TableCard
                      key={item._id}
                      item={item}
                      mappedMaterials={mappedMaterials}
                    />
                  );
                })}
              </div>
            ))}

            {/* Loading more indicator */}
            {isFetchingNextPage && (
              <div className="space-y-4" aria-label="Loading more requests">
                {[...Array(2)].map((_, i) => (
                  <MaterialRequestSkeleton key={`loading-${i}`} />
                ))}
              </div>
            )}

            {/* Intersection observer anchor */}
            {hasNextPage && (
              <div ref={loadMoreRef} className="h-2" aria-hidden="true" />
            )}

            {/* End of results indicator */}
            {!hasNextPage && data?.pages?.[0]?.data?.length > 0 && (
              <div className="text-center py-6 text-gray-500 text-sm">
                You&apos;ve reached the end of the list
              </div>
            )}
          </div>
        )}
      </div>
    </AsideContainer>
  );
};

export default Page;
