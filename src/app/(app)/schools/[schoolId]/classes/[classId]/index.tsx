import { useLocalSearchParams } from "expo-router";

import ClassDetailsScreen from "@/features/classes/presentation/screens/class-details/class-details";

export default function ClassDetails() {
    const { schoolId, classId } = useLocalSearchParams<{
        schoolId: string;
        classId: string;
    }>();

    return <ClassDetailsScreen schoolId={schoolId} classId={classId} />;
}
