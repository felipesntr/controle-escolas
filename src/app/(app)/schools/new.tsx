import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Button,
    Text,
    TextInput,
    View,
} from "react-native";

export default function NewSchoolPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");

    function handleSubmit() {
        if (!name.trim()) {
            return;
        }

        const school = {
            name: name.trim(),
            address: address.trim(),
        };

        console.log(school);

        // Depois de salvar na API:
        router.back();
    }

    return (
        <View>
            <Text>Nova escola</Text>

            <TextInput
                placeholder="Nome da escola"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                placeholder="Endereço"
                value={address}
                onChangeText={setAddress}
            />

            <Button
                title="Cadastrar"
                onPress={handleSubmit}
            />
        </View>
    );
}