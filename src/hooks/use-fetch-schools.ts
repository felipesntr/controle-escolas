import { useNavigation } from "expo-router";
import { useEffect } from "react";

import type { School } from "@/domain/school/school";
import { useSchoolStore } from "@/stores/school.store";

type UseFetchSchoolsResult = {
    schools: School[];
    loading: boolean;
    error: string | null;
};

export function useFetchSchools(): UseFetchSchoolsResult {
    const navigation = useNavigation();
    const fetchSchools = useSchoolStore((state) => state.fetchSchools);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            fetchSchools({ silent: true });
        });

        return unsubscribe;
    }, [navigation, fetchSchools]);

    return {
        schools: useSchoolStore((state) => state.schools),
        loading: useSchoolStore((state) => state.loading),
        error: useSchoolStore((state) => state.error),
    };
}
