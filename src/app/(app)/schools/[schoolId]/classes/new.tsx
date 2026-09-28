import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

import {
    FormControl,
    FormControlLabel,
    FormControlLabelText,
} from "@/components/ui/form-control";

import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useClassStore } from "../../../../../stores/class.store";

export default function NewClassPage() {
    const router = useRouter();

    const { schoolId } =
        useLocalSearchParams<{
            schoolId: string;
        }>();

    const addClass = useClassStore(
        (state) => state.addClass
    );

    const creating = useClassStore(
        (state) => state.creating
    );

    const error = useClassStore(
        (state) => state.error
    );

    const [name, setName] = useState("");
    const [grade, setGrade] = useState("");
    const [shift, setShift] = useState("");

    async function handleSubmit() {
        if (
            !schoolId ||
            !name.trim() ||
            !grade.trim() ||
            !shift.trim()
        ) {
            return;
        }

        try {
            await addClass(schoolId, {
                name: name.trim(),
                grade: grade.trim(),
                shift: shift.trim(),
            });

            router.back();
        } catch {
            // Erro já está no Zustand.
        }
    }
    return (
        <VStack className="flex-1 bg-background px-5 pt-6">
            <VStack className="gap-1">
                <Heading size="2xl">
                    Nova turma
                </Heading>

                <Text className="text-typography-500">
                    Cadastre uma nova turma.
                </Text>
            </VStack>

            <Card className="mt-6 rounded-2xl p-4">
                <VStack>
                    <Text className="text-sm text-typography-500">
                        Escola
                    </Text>

                    <Heading size="md">
                        Escola Municipal João Silva
                    </Heading>
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

                <Button
                    size="lg"
                    className="mt-3"
                    onPress={handleSubmit}
                >
                    <ButtonText>
                        Cadastrar turma
                    </ButtonText>
                </Button>
            </VStack>
        </VStack>
    );
}