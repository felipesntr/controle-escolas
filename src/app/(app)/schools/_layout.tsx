import { Stack } from "expo-router";

export default function SchoolsLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: "Escolas",
                }}
            />

            <Stack.Screen
                name="new"
                options={{
                    title: "Nova escola",
                }}
            />

            <Stack.Screen
                name="[schoolId]"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}