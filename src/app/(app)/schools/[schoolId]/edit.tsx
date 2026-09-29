import { useLocalSearchParams } from "expo-router";

import EditSchoolScreen from "@/features/schools/presentation/screens/edit-school/edit-school";

export default function EditSchool() {
    const { schoolId } = useLocalSearchParams<{
        schoolId: string;
    }>();

    return <EditSchoolScreen schoolId={schoolId} />;
}
