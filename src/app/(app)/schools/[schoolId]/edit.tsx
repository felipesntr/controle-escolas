import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { useFeedbackToast } from "@/shared/components/app-toast";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { LoadingBlock } from "@/shared/components/loading-block";
import { Alert, AlertIcon, AlertText } from "@/shared/components/ui/alert";
import { Button, ButtonIcon, ButtonText } from "@/shared/components/ui/button";
import {
    FormControl,
    FormControlLabel,
    FormControlLabelText,
} from "@/shared/components/ui/form-control";
import { AlertCircleIcon, CheckIcon, TrashIcon } from "@/shared/components/ui/icon";
import { Input, InputField } from "@/shared/components/ui/input";
import { Progress, ProgressFilledTrack } from "@/shared/components/ui/progress";
import { Spinner } from "@/shared/components/ui/spinner";
import { Text } from "@/shared/components/ui/text";
import { VStack } from "@/shared/components/ui/vstack";
import { useSchoolStore } from "@/shared/stores/school.store";

export default function EditSchoolPage() {
    const router = useRouter();
    const showToast = useFeedbackToast();

    const { schoolId } = useLocalSearchParams<{
        schoolId: string;
    }>();

    const school = useSchoolStore((state) => state.selectedSchool);
    const updating = useSchoolStore((state) => state.updating);
    const deleting = useSchoolStore((state) => state.deleting);
    const error = useSchoolStore((state) => state.error);
    const fetchSchool = useSchoolStore((state) => state.fetchSchool);
    const editSchool = useSchoolStore((state) => state.editSchool);
    const removeSchool = useSchoolStore((state) => state.removeSchool);
    const clearError = useSchoolStore((state) => state.clearError);

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [hydrated, setHydrated] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const filledFields = [name, address, city].filter((value) =>
        value.trim()
    ).length;
    const progress = Math.round((filledFields / 3) * 100);

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

    async function handleDelete() {
        if (!schoolId) {
            return;
        }

        try {
            await removeSchool(schoolId);
            showToast(
                "Escola excluída",
                "A escola e as turmas dela foram removidas."
            );
            router.replace("/schools");
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
        <VStack className="flex-1 bg-background px-4 pt-4">
            <Text className="text-typography-500">
                Atualize os dados da escola.
            </Text>

            <Progress value={updating ? 100 : progress} className="mt-4">
                <ProgressFilledTrack />
            </Progress>

            <VStack className="mt-8 gap-5">
                <FormControl>
                    <FormControlLabel>
                        <FormControlLabelText>
                            Nome da escola
                        </FormControlLabelText>
                    </FormControlLabel>

                    <Input className="mt-2">
                        <InputField
                            placeholder="Ex.: Escola Municipal João Silva"
                            value={name}
                            onChangeText={setName}
                        />
                    </Input>
                </FormControl>

                <FormControl>
                    <FormControlLabel>
                        <FormControlLabelText>Endereço</FormControlLabelText>
                    </FormControlLabel>

                    <Input className="mt-2">
                        <InputField
                            placeholder="Rua, número..."
                            value={address}
                            onChangeText={setAddress}
                        />
                    </Input>
                </FormControl>

                <FormControl>
                    <FormControlLabel>
                        <FormControlLabelText>Cidade</FormControlLabelText>
                    </FormControlLabel>

                    <Input className="mt-2">
                        <InputField
                            placeholder="Ex.: Aracaju"
                            value={city}
                            onChangeText={setCity}
                        />
                    </Input>
                </FormControl>

                {(formError || error) && !confirmDelete ? (
                    <Alert variant="destructive">
                        <AlertIcon as={AlertCircleIcon} />
                        <AlertText>{formError ?? error}</AlertText>
                    </Alert>
                ) : null}

                <Button
                    size="lg"
                    className="mt-3"
                    disabled={updating || deleting}
                    onPress={handleSubmit}
                >
                    {updating ? (
                        <Spinner size="small" color="#fafafa" />
                    ) : (
                        <ButtonIcon as={CheckIcon} />
                    )}
                    <ButtonText>
                        {updating ? "Salvando..." : "Salvar alterações"}
                    </ButtonText>
                </Button>

                <Button
                    size="lg"
                    variant="destructive"
                    disabled={updating || deleting}
                    onPress={() => {
                        clearError();
                        setConfirmDelete(true);
                    }}
                >
                    <ButtonIcon as={TrashIcon} />
                    <ButtonText>Excluir escola</ButtonText>
                </Button>
            </VStack>

            <ConfirmDialog
                visible={confirmDelete}
                title="Excluir escola?"
                description={`A escola "${name}" e as turmas dela serão removidas.`}
                error={confirmDelete ? error : null}
                loading={deleting}
                onCancel={() => {
                    clearError();
                    setConfirmDelete(false);
                }}
                onConfirm={handleDelete}
            />
        </VStack>
    );
}
