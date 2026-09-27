import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Button,
    Text,
    TextInput,
    View,
} from "react-native";

export default function NewClassPage() {
    const { schoolId } = useLocalSearchParams<{
        schoolId: string;
    }>();

    const router = useRouter();

    function handleSubmit() {
        const newClass = {
            name: "6º Ano A",
            schoolId,
        };

        console.log(newClass);

        router.back();
    }

    return (
        <View>
            <Text>Nova turma</Text>

            <TextInput placeholder="Nome da turma" />

            <Button
                title="Cadastrar"
                onPress={handleSubmit}
            />
        </View>
    );
}