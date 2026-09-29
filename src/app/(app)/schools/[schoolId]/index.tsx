import { useLocalSearchParams } from "expo-router";

import SchoolDetailsScreen from "@/features/schools/presentation/screens/school-details/school-details";

export default function SchoolDetails() {
    const { schoolId } = useLocalSearchParams<{
        schoolId: string;
    }>();

    return <SchoolDetailsScreen schoolId={schoolId} />;
}
