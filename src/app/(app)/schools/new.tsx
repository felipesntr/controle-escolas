import { useRouter } from "expo-router";
import { useState } from "react";

import {
    FormControl,
    FormControlLabel,
    FormControlLabelText,
} from "@/components/ui/form-control";

import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useSchoolStore } from "@/stores/school.store";

export default function NewSchoolPage() {
    const router = useRouter();

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

    async function handleSubmit() {
        if (!name.trim()) {
            return;
        }

        try {
            await addSchool({
                name: name.trim(),
                address: address.trim(),
                city: city.trim(),
            });

            router.back();
        } catch {
            // O erro já está no Zustand.
        }
    }

    return (
        <VStack className="flex-1 bg-background px-5 pt-6">
            <VStack className="gap-1">
                <Heading size="2xl">
                    Nova escola
                </Heading>

                <Text className="text-typography-500">
                    Cadastre uma nova escola pública.
                </Text>
            </VStack>

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

                <Button
                    size="lg"
                    className="mt-3"
                    onPress={handleSubmit}
                >
                    <ButtonText>
                        Cadastrar escola
                    </ButtonText>
                </Button>
            </VStack>
        </VStack>
    );
}