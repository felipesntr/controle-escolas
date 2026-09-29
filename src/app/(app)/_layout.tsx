import { Stack } from "expo-router";

import { screenBackground } from "@/shared/constants/navigation";

export default function AppLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: screenBackground },
            }}
        >
            <Stack.Screen
                name="schools"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}