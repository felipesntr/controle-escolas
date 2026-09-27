import { Stack } from "expo-router";

export default function SchoolLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: "Escola",
                }}
            />

            <Stack.Screen
                name="classes/index"
                options={{
                    title: "Turmas",
                }}
            />

            <Stack.Screen
                name="classes/new"
                options={{
                    title: "Nova turma",
                }}
            />
        </Stack>
    );
}