import { useMemo, useState } from "react";

const PAGE_SIZE = 5;

type UsePagedListResult<T> = {
    query: string;
    setQuery: (value: string) => void;
    page: number;
    setPage: (value: number) => void;
    pageCount: number;
    pageItems: T[];
    total: number;
};

export function usePagedList<T>(
    items: T[],
    matches: (item: T, query: string) => boolean
): UsePagedListResult<T> {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        const term = query.trim().toLowerCase();

        if (!term) {
            return items;
        }

        return items.filter((item) => matches(item, term));
    }, [items, matches, query]);

    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(page, pageCount);
    const start = (currentPage - 1) * PAGE_SIZE;

    function updateQuery(value: string) {
        setQuery(value);
        setPage(1);
    }

    return {
        query,
        setQuery: updateQuery,
        page: currentPage,
        setPage,
        pageCount,
        pageItems: filtered.slice(start, start + PAGE_SIZE),
        total: filtered.length,
    };
}
