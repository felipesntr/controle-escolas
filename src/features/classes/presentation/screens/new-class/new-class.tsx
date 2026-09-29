import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";

import {
    CLASS_GRADES,
    CLASS_SHIFTS,
} from "@/features/classes/presentation/class-options";
import { useClassStore } from "@/features/classes/stores/class.store";
import { useSchoolStore } from "@/features/schools/stores/school.store";
import { useFeedbackToast } from "@/shared/components/app-toast";
import { SelectField } from "@/shared/components/select-field";
import { Alert, AlertIcon, AlertText } from "@/shared/components/ui/alert";
import { Button, ButtonText } from "@/shared/components/ui/button";
import { Heading } from "@/shared/components/ui/heading";
import { HStack } from "@/shared/components/ui/hstack";
import { AlertCircleIcon } from "@/shared/components/ui/icon";
import { Input, InputField } from "@/shared/components/ui/input";
import { Spinner } from "@/shared/components/ui/spinner";
import { Text } from "@/shared/components/ui/text";
import { VStack } from "@/shared/components/ui/vstack";

type NewClassScreenProps = {
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

export default function NewClassScreen({ schoolId }: NewClassScreenProps) {
    const router = useRouter();
    const showToast = useFeedbackToast();

    const addClass = useClassStore((state) => state.addClass);
    const creating = useClassStore((state) => state.creating);
    const error = useClassStore((state) => state.error);

    const school = useSchoolStore((state) => state.selectedSchool);
    const fetchSchool = useSchoolStore((state) => state.fetchSchool);

    const [name, setName] = useState("");
    const [grade, setGrade] = useState("");
    const [shift, setShift] = useState("");
    const [formError, setFormError] = useState<string | null>(null);

    const schoolReady = school?.id === schoolId;

    useEffect(() => {
        if (!schoolId || school?.id === schoolId) {
            return;
        }

        fetchSchool(schoolId);
    }, [schoolId, school?.id, fetchSchool]);

    async function handleSubmit() {
        if (!schoolId || !name.trim() || !grade.trim() || !shift.trim()) {
            setFormError("Preencha nome, ano/série e turno.");
            return;
        }

        setFormError(null);

        try {
            await addClass(schoolId, {
                name: name.trim(),
                grade: grade.trim(),
                shift: shift.trim(),
            });

            showToast("Turma cadastrada", `${name.trim()} foi adicionada.`);
            router.back();
        } catch {
            // Erro já está no Zustand.
        }
    }

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
            keyboardShouldPersistTaps="handled"
        >
            <HStack className="items-center gap-3 rounded-2xl border border-border bg-white p-4">
                <VStack className="h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                    <Ionicons name="business" size={20} color="#2563eb" />
                </VStack>
                <VStack className="flex-1">
                    <Text size="xs" className="text-muted-foreground">
                        Escola
                    </Text>
                    <Heading size="sm">
                        {schoolReady ? school.name : "Carregando escola..."}
                    </Heading>
                    {schoolReady ? (
                        <HStack className="items-center gap-1">
                            <Ionicons name="location-outline" size={12} color="#737373" />
                            <Text size="sm" className="text-muted-foreground">
                                {school.city}
                            </Text>
                        </HStack>
                    ) : (
                        <Spinner className="mt-2" size="small" />
                    )}
                </VStack>
            </HStack>

            <VStack className="mt-4 gap-4 rounded-2xl border border-border bg-white p-4">
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
                    options={CLASS_GRADES}
                    onChange={setGrade}
                />

                <SelectField
                    label="Turno"
                    required
                    value={shift}
                    placeholder="Selecione o turno"
                    options={CLASS_SHIFTS}
                    onChange={setShift}
                />
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
                <ButtonText>{creating ? "Cadastrando..." : "Cadastrar turma"}</ButtonText>
            </Button>
        </ScrollView>
    );
}
