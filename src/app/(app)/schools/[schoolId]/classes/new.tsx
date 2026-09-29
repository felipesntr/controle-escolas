import { useLocalSearchParams } from "expo-router";

import NewClassScreen from "@/features/classes/presentation/screens/new-class/new-class";

export default function NewClass() {
    const { schoolId } = useLocalSearchParams<{
        schoolId: string;
    }>();

    return <NewClassScreen schoolId={schoolId} />;
}
