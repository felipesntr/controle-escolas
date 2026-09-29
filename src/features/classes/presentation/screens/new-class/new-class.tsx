import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import {
    FormControl,
    FormControlLabel,
    FormControlLabelText,
} from "@/shared/components/ui/form-control";

import { useFeedbackToast } from "@/shared/components/app-toast";
import { Alert, AlertIcon, AlertText } from "@/shared/components/ui/alert";
import { Button, ButtonIcon, ButtonText } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Heading } from "@/shared/components/ui/heading";
import { AlertCircleIcon, CheckIcon } from "@/shared/components/ui/icon";
import { Input, InputField } from "@/shared/components/ui/input";
import { Progress, ProgressFilledTrack } from "@/shared/components/ui/progress";
import { Spinner } from "@/shared/components/ui/spinner";
import { Text } from "@/shared/components/ui/text";
import { VStack } from "@/shared/components/ui/vstack";
import { useClassStore } from "@/shared/stores/class.store";
import { useSchoolStore } from "@/shared/stores/school.store";

type NewClassScreenProps = {
    schoolId: string;
};

export default function NewClassScreen({ schoolId }: NewClassScreenProps) {
    const router = useRouter();
    const showToast = useFeedbackToast();

    const addClass = useClassStore(
        (state) => state.addClass
    );

    const creating = useClassStore(
        (state) => state.creating
    );

    const error = useClassStore(
        (state) => state.error
    );

    const school = useSchoolStore((state) => state.selectedSchool);
    const fetchSchool = useSchoolStore((state) => state.fetchSchool);

    const [name, setName] = useState("");
    const [grade, setGrade] = useState("");
    const [shift, setShift] = useState("");
    const [formError, setFormError] = useState<string | null>(null);

    const schoolReady = school?.id === schoolId;
    const filledFields = [name, grade, shift].filter((value) =>
        value.trim()
    ).length;
    const progress = Math.round((filledFields / 3) * 100);

    useEffect(() => {
        if (!schoolId || school?.id === schoolId) {
            return;
        }

        fetchSchool(schoolId);
    }, [schoolId, school?.id, fetchSchool]);

    async function handleSubmit() {
        if (
            !schoolId ||
            !name.trim() ||
            !grade.trim() ||
            !shift.trim()
        ) {
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
        <VStack className="flex-1 bg-background px-4 pt-4">
            <Text className="text-typography-500">
                Cadastre uma nova turma.
            </Text>

            <Progress value={creating ? 100 : progress} className="mt-4">
                <ProgressFilledTrack />
            </Progress>

            <Card className="mt-6 rounded-2xl p-4">
                <VStack>
                    <Text className="text-sm text-typography-500">
                        Escola
                    </Text>

                    <Heading size="md">
                        {schoolReady ? school.name : "Carregando escola..."}
                    </Heading>

                    {schoolReady ? null : (
                        <Spinner className="mt-3" size="small" />
                    )}
                </VStack>
            </Card>

            <VStack className="mt-6 gap-5">
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
                        <FormControlLabelText>
                            Ano/Série
                        </FormControlLabelText>
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
                        <FormControlLabelText>
                            Turno
                        </FormControlLabelText>
                    </FormControlLabel>

                    <Input className="mt-2">
                        <InputField
                            placeholder="Ex.: Matutino"
                            value={shift}
                            onChangeText={setShift}
                        />
                    </Input>
                </FormControl>

                {formError || error ? (
                    <Alert variant="destructive">
                        <AlertIcon as={AlertCircleIcon} />
                        <AlertText>{formError ?? error}</AlertText>
                    </Alert>
                ) : null}

                <Button
                    size="lg"
                    className="mt-3"
                    disabled={creating}
                    onPress={handleSubmit}
                >
                    {creating ? (
                        <Spinner size="small" color="#fafafa" />
                    ) : (
                        <ButtonIcon as={CheckIcon} />
                    )}
                    <ButtonText>
                        {creating ? "Cadastrando..." : "Cadastrar turma"}
                    </ButtonText>
                </Button>
            </VStack>
        </VStack>
    );
}
