import { useLocalSearchParams } from "expo-router";

import EditClassScreen from "@/features/classes/presentation/screens/edit-class/edit-class";

export default function EditClass() {
    const { schoolId, classId } = useLocalSearchParams<{
        schoolId: string;
        classId: string;
    }>();

    return <EditClassScreen schoolId={schoolId} classId={classId} />;
}
