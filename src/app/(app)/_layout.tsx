import { Stack } from "expo-router";

export default function AppLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="schools"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}