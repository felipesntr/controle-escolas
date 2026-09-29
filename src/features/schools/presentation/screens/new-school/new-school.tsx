import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView } from "react-native";

import { useSchoolStore } from "@/features/schools/stores/school.store";
import { useFeedbackToast } from "@/shared/components/app-toast";
import { Alert, AlertIcon, AlertText } from "@/shared/components/ui/alert";
import { Button, ButtonText } from "@/shared/components/ui/button";
import { Heading } from "@/shared/components/ui/heading";
import { AlertCircleIcon } from "@/shared/components/ui/icon";
import { Input, InputField } from "@/shared/components/ui/input";
import { Spinner } from "@/shared/components/ui/spinner";
import { Text } from "@/shared/components/ui/text";
import { VStack } from "@/shared/components/ui/vstack";

function FieldLabel({ label }: { label: string }) {
    return (
        <Text className="text-sm font-medium text-foreground">
            {label}
            <Text className="text-destructive"> *</Text>
        </Text>
    );
}

export default function NewSchoolScreen() {
    const router = useRouter();
    const showToast = useFeedbackToast();

    const addSchool = useSchoolStore((state) => state.addSchool);
    const creating = useSchoolStore((state) => state.creating);
    const error = useSchoolStore((state) => state.error);

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [formError, setFormError] = useState<string | null>(null);

    async function handleSubmit() {
        if (!name.trim() || !address.trim() || !city.trim()) {
            setFormError("Preencha nome, endereço e cidade.");
            return;
        }

        setFormError(null);

        try {
            await addSchool({
                name: name.trim(),
                address: address.trim(),
                city: city.trim(),
            });

            showToast("Escola cadastrada", `${name.trim()} foi adicionada.`);
            router.back();
        } catch (submitError) {
            console.error("Erro ao cadastrar escola", submitError);
        }
    }

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
            keyboardShouldPersistTaps="handled"
        >
            <VStack className="items-center pt-2">
                <VStack className="h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Ionicons name="business" size={28} color="#2563eb" />
                </VStack>
                <Heading size="lg" className="mt-3">
                    Nova escola
                </Heading>
                <Text className="text-muted-foreground">
                    Cadastre uma nova escola pública.
                </Text>
            </VStack>

            <VStack className="mt-6 gap-4 rounded-2xl border border-border bg-white p-4">
                <Heading size="sm">Dados da escola</Heading>

                <VStack className="gap-2">
                    <FieldLabel label="Nome da escola" />
                    <Input className="h-12 rounded-xl bg-white">
                        <InputField
                            placeholder="Ex.: Escola Municipal João Silva"
                            value={name}
                            onChangeText={setName}
                        />
                    </Input>
                </VStack>

                <VStack className="gap-2">
                    <FieldLabel label="Endereço" />
                    <Input className="h-12 rounded-xl bg-white">
                        <InputField
                            placeholder="Rua, número, bairro..."
                            value={address}
                            onChangeText={setAddress}
                        />
                    </Input>
                </VStack>

                <VStack className="gap-2">
                    <FieldLabel label="Cidade" />
                    <Input className="h-12 rounded-xl bg-white">
                        <InputField
                            placeholder="Ex.: Aracaju"
                            value={city}
                            onChangeText={setCity}
                        />
                    </Input>
                </VStack>
            </VStack>

            {formError || error ? (
                <Alert variant="destructive" className="mt-4">
                    <AlertIcon as={AlertCircleIcon} />
                    <AlertText>{formError ?? error}</AlertText>
                </Alert>
            ) : null}

            <Button
                size="lg"
                className="mt-6 h-12 rounded-xl"
                disabled={creating}
                onPress={handleSubmit}
            >
                {creating ? <Spinner size="small" color="#ffffff" /> : null}
                <ButtonText>{creating ? "Cadastrando..." : "Cadastrar escola"}</ButtonText>
            </Button>
        </ScrollView>
    );
}
