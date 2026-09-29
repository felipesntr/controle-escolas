import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";

import { useSchoolStore } from "@/features/schools/stores/school.store";
import { useFeedbackToast } from "@/shared/components/app-toast";
import { LoadingBlock } from "@/shared/components/loading-block";
import { Alert, AlertIcon, AlertText } from "@/shared/components/ui/alert";
import { Button, ButtonText } from "@/shared/components/ui/button";
import { Heading } from "@/shared/components/ui/heading";
import { AlertCircleIcon } from "@/shared/components/ui/icon";
import { Input, InputField } from "@/shared/components/ui/input";
import { Spinner } from "@/shared/components/ui/spinner";
import { Text } from "@/shared/components/ui/text";
import { VStack } from "@/shared/components/ui/vstack";

type EditSchoolScreenProps = {
    schoolId: string;
};

function FieldLabel({ label }: { label: string }) {
    return (
        <Text className="text-sm font-medium text-foreground">
            {label}
            <Text className="text-destructive"> *</Text>
        </Text>
    );
}

export default function EditSchoolScreen({ schoolId }: EditSchoolScreenProps) {
    const router = useRouter();
    const showToast = useFeedbackToast();

    const school = useSchoolStore((state) => state.selectedSchool);
    const updating = useSchoolStore((state) => state.updating);
    const error = useSchoolStore((state) => state.error);
    const fetchSchool = useSchoolStore((state) => state.fetchSchool);
    const editSchool = useSchoolStore((state) => state.editSchool);
    const clearError = useSchoolStore((state) => state.clearError);

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [hydrated, setHydrated] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        clearError();
    }, [clearError]);

    useEffect(() => {
        if (!schoolId) {
            return;
        }

        fetchSchool(schoolId);
    }, [schoolId, fetchSchool]);

    useEffect(() => {
        if (!school || school.id !== schoolId || hydrated) {
            return;
        }

        setName(school.name);
        setAddress(school.address);
        setCity(school.city);
        setHydrated(true);
    }, [school, schoolId, hydrated]);

    async function handleSubmit() {
        if (!schoolId || !name.trim() || !address.trim() || !city.trim()) {
            setFormError("Preencha nome, endereço e cidade.");
            return;
        }

        setFormError(null);

        try {
            await editSchool(schoolId, {
                name: name.trim(),
                address: address.trim(),
                city: city.trim(),
            });

            showToast("Escola atualizada", "As alterações foram salvas.");
            router.back();
        } catch {
            // O erro já está no Zustand.
        }
    }

    if (!hydrated) {
        return (
            <VStack className="flex-1 items-center justify-center bg-background px-8">
                {error ? (
                    <Alert variant="destructive">
                        <AlertIcon as={AlertCircleIcon} />
                        <AlertText>{error}</AlertText>
                    </Alert>
                ) : (
                    <LoadingBlock label="Carregando escola..." />
                )}
            </VStack>
        );
    }

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
            keyboardShouldPersistTaps="handled"
        >
            <VStack className="gap-4 rounded-2xl border border-border bg-white p-4">
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
                disabled={updating}
                onPress={handleSubmit}
            >
                {updating ? <Spinner size="small" color="#ffffff" /> : null}
                <ButtonText>{updating ? "Salvando..." : "Salvar alterações"}</ButtonText>
            </Button>
        </ScrollView>
    );
}
