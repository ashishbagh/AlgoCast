import React, { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

const PAGE_BATCH_SIZE = 20;

async function fetchPages({ pageParam = 0 }) {
  const res = await fetch(
    `/api/document/123/pages?offset=${pageParam}&limit=${PAGE_BATCH_SIZE}`,
  );
  return res.json();
}

export default function DocumentViewer() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["document-pages", "123"],
      queryFn: fetchPages,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        return lastPage.hasMore ? lastPage.nextOffset : undefined;
      },
    });

  const pages = useMemo(() => {
    return data ? data.pages.flatMap((group) => group.pages) : [];
  }, [data]);

  function handleItemsRendered({ visibleStopIndex }) {
    const threshold = 5;

    if (
      hasNextPage &&
      !isFetchingNextPage &&
      visibleStopIndex >= pages.length - threshold
    ) {
      fetchNextPage();
    }
  }

  return (
    <VirtualizedList items={pages} onItemsRendered={handleItemsRendered} />
  );
}
