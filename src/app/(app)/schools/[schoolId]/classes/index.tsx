import { useLocalSearchParams } from "expo-router";

import HomeClassesScreen from "@/features/classes/presentation/screens/home-classes/home-classes";

export default function HomeClasses() {
    const { schoolId } = useLocalSearchParams<{
        schoolId: string;
    }>();

    return <HomeClassesScreen schoolId={schoolId} />;
}
