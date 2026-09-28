import { Stack } from "expo-router";

export default function ClassesLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: "Turmas",
                }}
            />

            <Stack.Screen
                name="new"
                options={{
                    title: "Nova turma",
                }}
            />
        </Stack>
    );
}