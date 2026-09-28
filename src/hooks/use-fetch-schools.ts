import { useSchoolStore } from "@/stores/school.store";
import { useEffect } from "react";


type UseFetchSchoolsResult = {
    schools: any[];
    loading: boolean;
    error: string | null;
};

export function useFetchSchools(): UseFetchSchoolsResult {
    const fetchSchools = useSchoolStore(
        (state) => state.fetchSchools
    );

    useEffect(() => {
        fetchSchools();
    }, [fetchSchools]);


    return {
        schools: useSchoolStore((state) => state.schools),
        loading: useSchoolStore((state) => state.loading),
        error: useSchoolStore((state) => state.error),
    };
}
