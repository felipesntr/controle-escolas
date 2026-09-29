import type { ElementType } from "react";
import { Modal, Pressable, StyleSheet } from "react-native";

import { Heading } from "@/shared/components/ui/heading";
import { HStack } from "@/shared/components/ui/hstack";
import { ChevronRightIcon, CloseIcon, Icon } from "@/shared/components/ui/icon";
import { Text } from "@/shared/components/ui/text";
import { VStack } from "@/shared/components/ui/vstack";

export type ActionSheetAction = {
    id: string;
    label: string;
    description?: string;
    icon: ElementType;
    tone?: "default" | "danger";
    onPress: () => void;
};

type ActionSheetProps = {
    visible: boolean;
    title: string;
    subtitle?: string;
    actions: ActionSheetAction[];
    onClose: () => void;
};

export function ActionSheet({
    visible,
    title,
    subtitle,
    actions,
    onClose,
}: ActionSheetProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable style={styles.backdrop} onPress={onClose}>
                <Pressable style={styles.sheet} onPress={() => undefined}>
                    <VStack className="mb-3 items-center">
                        <VStack className="mb-3 h-1 w-10 rounded-full bg-border" />
                        <Heading size="md" className="text-center">
                            {title}
                        </Heading>
                        {subtitle ? (
                            <Text size="sm" className="text-muted-foreground">
                                {subtitle}
                            </Text>
                        ) : null}
                    </VStack>

                    <VStack className="gap-2">
                        {actions.map((action) => {
                            const danger = action.tone === "danger";

                            return (
                                <Pressable
                                    key={action.id}
                                    onPress={action.onPress}
                                    className={`rounded-2xl border px-4 py-3 ${
                                        danger
                                            ? "border-destructive/20 bg-destructive/5"
                                            : "border-border bg-background"
                                    }`}
                                >
                                    <HStack className="items-center gap-3">
                                        <VStack
                                            className={`h-10 w-10 items-center justify-center rounded-full ${
                                                danger ? "bg-destructive/10" : "bg-primary/10"
                                            }`}
                                        >
                                            <Icon
                                                as={action.icon}
                                                size="sm"
                                                className={
                                                    danger ? "text-destructive" : "text-primary"
                                                }
                                            />
                                        </VStack>
                                        <VStack className="flex-1">
                                            <Text
                                                className={`font-medium ${
                                                    danger ? "text-destructive" : "text-foreground"
                                                }`}
                                            >
                                                {action.label}
                                            </Text>
                                            {action.description ? (
                                                <Text size="sm" className="text-muted-foreground">
                                                    {action.description}
                                                </Text>
                                            ) : null}
                                        </VStack>
                                        <Icon
                                            as={ChevronRightIcon}
                                            size="sm"
                                            className="text-muted-foreground"
                                        />
                                    </HStack>
                                </Pressable>
                            );
                        })}
                    </VStack>

                    <Pressable
                        onPress={onClose}
                        className="mt-3 items-center rounded-2xl bg-secondary py-3"
                    >
                        <HStack className="items-center gap-2">
                            <Icon as={CloseIcon} size="sm" className="text-foreground" />
                            <Text className="font-medium">Cancelar</Text>
                        </HStack>
                    </Pressable>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.45)",
    },
    sheet: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: "#ffffff",
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 28,
    },
});
