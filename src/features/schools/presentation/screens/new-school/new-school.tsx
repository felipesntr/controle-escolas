import { useRouter } from "expo-router";
import { useState } from "react";

import {
    FormControl,
    FormControlLabel,
    FormControlLabelText,
} from "@/shared/components/ui/form-control";

import { useFeedbackToast } from "@/shared/components/app-toast";
import { Alert, AlertIcon, AlertText } from "@/shared/components/ui/alert";
import { Button, ButtonIcon, ButtonText } from "@/shared/components/ui/button";
import { AlertCircleIcon, CheckIcon } from "@/shared/components/ui/icon";
import { Input, InputField } from "@/shared/components/ui/input";
import { Progress, ProgressFilledTrack } from "@/shared/components/ui/progress";
import { Spinner } from "@/shared/components/ui/spinner";
import { Text } from "@/shared/components/ui/text";
import { VStack } from "@/shared/components/ui/vstack";
import { useSchoolStore } from "@/shared/stores/school.store";

export default function NewSchoolScreen() {
    const router = useRouter();
    const showToast = useFeedbackToast();

    const addSchool = useSchoolStore(
        (state) => state.addSchool
    );

    const creating = useSchoolStore(
        (state) => state.creating
    );

    const error = useSchoolStore(
        (state) => state.error
    );

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [formError, setFormError] = useState<string | null>(null);

    const filledFields = [name, address, city].filter((value) =>
        value.trim()
    ).length;
    const progress = Math.round((filledFields / 3) * 100);

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
        } catch (error) {
            console.error("Erro ao cadastrar escola", error);
            // O erro já está no Zustand.
        }
    }

    return (
        <VStack className="flex-1 bg-background px-4 pt-4">
            <Text className="text-typography-500">
                Cadastre uma nova escola pública.
            </Text>

            <Progress value={creating ? 100 : progress} className="mt-4">
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
                        <FormControlLabelText>
                            Endereço
                        </FormControlLabelText>
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
                        <FormControlLabelText>
                            Cidade
                        </FormControlLabelText>
                    </FormControlLabel>

                    <Input className="mt-2">
                        <InputField
                            placeholder="Ex.: Aracaju"
                            value={city}
                            onChangeText={setCity}
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
                        {creating ? "Cadastrando..." : "Cadastrar escola"}
                    </ButtonText>
                </Button>
            </VStack>
        </VStack>
    );
}