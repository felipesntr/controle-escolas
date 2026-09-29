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
import { useClassStore } from "@/shared/stores/class.store";

export default function EditClassPage() {
    const router = useRouter();
    const showToast = useFeedbackToast();

    const { schoolId, classId } = useLocalSearchParams<{
        schoolId: string;
        classId: string;
    }>();

    const selectedClass = useClassStore((state) => state.selectedClass);
    const updating = useClassStore((state) => state.updating);
    const deleting = useClassStore((state) => state.deleting);
    const error = useClassStore((state) => state.error);
    const fetchClass = useClassStore((state) => state.fetchClass);
    const editClass = useClassStore((state) => state.editClass);
    const removeClass = useClassStore((state) => state.removeClass);
    const clearError = useClassStore((state) => state.clearError);

    const [name, setName] = useState("");
    const [grade, setGrade] = useState("");
    const [shift, setShift] = useState("");
    const [hydrated, setHydrated] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const filledFields = [name, grade, shift].filter((value) =>
        value.trim()
    ).length;
    const progress = Math.round((filledFields / 3) * 100);

    useEffect(() => {
        clearError();
    }, [clearError]);

    useEffect(() => {
        if (!schoolId || !classId) {
            return;
        }

        fetchClass(schoolId, classId);
    }, [schoolId, classId, fetchClass]);

    useEffect(() => {
        if (!selectedClass || selectedClass.id !== classId || hydrated) {
            return;
        }

        setName(selectedClass.name);
        setGrade(selectedClass.grade);
        setShift(selectedClass.shift);
        setHydrated(true);
    }, [selectedClass, classId, hydrated]);

    async function handleSubmit() {
        if (
            !schoolId ||
            !classId ||
            !name.trim() ||
            !grade.trim() ||
            !shift.trim()
        ) {
            setFormError("Preencha nome, ano/série e turno.");
            return;
        }

        setFormError(null);

        try {
            await editClass(schoolId, classId, {
                name: name.trim(),
                grade: grade.trim(),
                shift: shift.trim(),
            });

            showToast("Turma atualizada", "As alterações foram salvas.");
            router.back();
        } catch {
            // O erro já está no Zustand.
        }
    }

    async function handleDelete() {
        if (!schoolId || !classId) {
            return;
        }

        try {
            await removeClass(schoolId, classId);
            showToast("Turma excluída", `${name.trim()} foi removida.`);
            router.replace({
                pathname: "/schools/[schoolId]/classes",
                params: { schoolId },
            });
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
                    <LoadingBlock label="Carregando turma..." />
                )}
            </VStack>
        );
    }

    return (
        <VStack className="flex-1 bg-background px-4 pt-4">
            <Text className="text-typography-500">
                Atualize os dados da turma.
            </Text>

            <Progress value={updating ? 100 : progress} className="mt-4">
                <ProgressFilledTrack />
            </Progress>

            <VStack className="mt-8 gap-5">
                <FormControl>
                    <FormControlLabel>
                        <FormControlLabelText>
                            Nome da turma
                        </FormControlLabelText>
                    </FormControlLabel>

                    <Input className="mt-2">
                        <InputField
                            placeholder="Ex.: 6º Ano A"
                            value={name}
                            onChangeText={setName}
                        />
                    </Input>
                </FormControl>

                <FormControl>
                    <FormControlLabel>
                        <FormControlLabelText>Ano/Série</FormControlLabelText>
                    </FormControlLabel>

                    <Input className="mt-2">
                        <InputField
                            placeholder="Ex.: 6º Ano"
                            value={grade}
                            onChangeText={setGrade}
                        />
                    </Input>
                </FormControl>

                <FormControl>
                    <FormControlLabel>
                        <FormControlLabelText>Turno</FormControlLabelText>
                    </FormControlLabel>

                    <Input className="mt-2">
                        <InputField
                            placeholder="Ex.: Matutino"
                            value={shift}
                            onChangeText={setShift}
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
                    <ButtonText>Excluir turma</ButtonText>
                </Button>
            </VStack>

            <ConfirmDialog
                visible={confirmDelete}
                title="Excluir turma?"
                description={`A turma "${name}" será removida.`}
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
