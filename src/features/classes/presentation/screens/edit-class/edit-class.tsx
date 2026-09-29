import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView } from "react-native";

import {
    CLASS_GRADES,
    CLASS_SHIFTS,
    withCurrentOption,
} from "@/features/classes/presentation/class-options";
import { useClassStore } from "@/features/classes/stores/class.store";
import { useFeedbackToast } from "@/shared/components/app-toast";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { LoadingBlock } from "@/shared/components/loading-block";
import { SelectField } from "@/shared/components/select-field";
import { Alert, AlertIcon, AlertText } from "@/shared/components/ui/alert";
import { Button, ButtonText } from "@/shared/components/ui/button";
import { Heading } from "@/shared/components/ui/heading";
import { AlertCircleIcon } from "@/shared/components/ui/icon";
import { Input, InputField } from "@/shared/components/ui/input";
import { Spinner } from "@/shared/components/ui/spinner";
import { Text } from "@/shared/components/ui/text";
import { VStack } from "@/shared/components/ui/vstack";

type EditClassScreenProps = {
    schoolId: string;
    classId: string;
};

function FieldLabel({ label }: { label: string }) {
    return (
        <Text className="text-sm font-medium text-foreground">
            {label}
            <Text className="text-destructive"> *</Text>
        </Text>
    );
}

export default function EditClassScreen({ schoolId, classId }: EditClassScreenProps) {
    const router = useRouter();
    const showToast = useFeedbackToast();

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
        if (!schoolId || !classId || !name.trim() || !grade.trim() || !shift.trim()) {
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
        <ScrollView
            className="flex-1 bg-background"
            contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
            keyboardShouldPersistTaps="handled"
        >
            <VStack className="gap-4 rounded-2xl border border-border bg-white p-4">
                <Heading size="sm">Dados da turma</Heading>

                <VStack className="gap-2">
                    <FieldLabel label="Nome da turma" />
                    <Input className="h-12 rounded-xl bg-white">
                        <InputField
                            placeholder="Ex.: 6º Ano A"
                            value={name}
                            onChangeText={setName}
                        />
                    </Input>
                </VStack>

                <SelectField
                    label="Ano/Série"
                    required
                    value={grade}
                    placeholder="Selecione o ano/série"
                    options={withCurrentOption(CLASS_GRADES, grade)}
                    onChange={setGrade}
                />

                <SelectField
                    label="Turno"
                    required
                    value={shift}
                    placeholder="Selecione o turno"
                    options={withCurrentOption(CLASS_SHIFTS, shift)}
                    onChange={setShift}
                />
            </VStack>

            {(formError || error) && !confirmDelete ? (
                <Alert variant="destructive" className="mt-4">
                    <AlertIcon as={AlertCircleIcon} />
                    <AlertText>{formError ?? error}</AlertText>
                </Alert>
            ) : null}

            <Button
                size="lg"
                className="mt-6 h-12 rounded-xl"
                disabled={updating || deleting}
                onPress={handleSubmit}
            >
                {updating ? <Spinner size="small" color="#ffffff" /> : null}
                <ButtonText>{updating ? "Salvando..." : "Salvar alterações"}</ButtonText>
            </Button>

            <Pressable
                disabled={updating || deleting}
                onPress={() => {
                    clearError();
                    setConfirmDelete(true);
                }}
                className="mt-3 items-center rounded-xl border border-destructive/30 bg-white py-3"
            >
                <Text className="font-medium text-destructive">Excluir turma</Text>
            </Pressable>

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
        </ScrollView>
    );
}
