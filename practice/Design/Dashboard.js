// GET /alerts?severity=critical&page=2&sort=createdAt:desc

//queryKey: ['alerts', filters, page, pageSize, sort]

const { isLoading, isError, data } = useQuery({
  queryFn: () => {},
  queryKey: ["alerts", alertId],
});

queryClient.invalidateQueries({ queryKey: [alerts] });

import { useInfiniteQuery } from "@tanstack/react-query";

function useAlerts(filters) {
  return useInfiniteQuery({
    queryKey: ["alerts", filters],
    queryFn: async ({ pageParam = null }) => {
      const params = new URLSearchParams();

      if (filters.severity) {
        params.set("severity", filters.severity);
      }

      if (pageParam) {
        params.set("cursor", pageParam);
      }

      const res = await fetch(`/api/alerts?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch alerts");

      return res.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: null,
  });
}

const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  useInfiniteQuery();
