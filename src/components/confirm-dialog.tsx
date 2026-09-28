import { Modal, Pressable, StyleSheet } from "react-native";

import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { AlertCircleIcon, TrashIcon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

type ConfirmDialogProps = {
    visible: boolean;
    title: string;
    description: string;
    error?: string | null;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

export function ConfirmDialog({
    visible,
    title,
    description,
    error,
    loading = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <Pressable
                style={styles.backdrop}
                onPress={loading ? undefined : onCancel}
            >
                <Pressable style={styles.sheet} onPress={() => undefined}>
                    <Card className="rounded-2xl bg-background p-5">
                        <VStack className="gap-4">
                            <Heading size="lg">{title}</Heading>

                            <Text className="text-typography-500">
                                {description}
                            </Text>

                            {error ? (
                                <Alert variant="destructive">
                                    <AlertIcon as={AlertCircleIcon} />
                                    <AlertText>{error}</AlertText>
                                </Alert>
                            ) : null}

                            <HStack className="justify-end gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={loading}
                                    onPress={onCancel}
                                >
                                    <ButtonText>Cancelar</ButtonText>
                                </Button>

                                <Button
                                    variant="destructive"
                                    size="sm"
                                    disabled={loading}
                                    onPress={onConfirm}
                                >
                                    {loading ? (
                                        <Spinner size="small" color="#ffffff" />
                                    ) : (
                                        <ButtonIcon as={TrashIcon} />
                                    )}
                                    <ButtonText>
                                        {loading ? "Excluindo..." : "Excluir"}
                                    </ButtonText>
                                </Button>
                            </HStack>
                        </VStack>
                    </Card>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        paddingHorizontal: 24,
    },
    sheet: {
        width: "100%",
    },
});
