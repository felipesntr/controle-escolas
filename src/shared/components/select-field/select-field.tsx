import { useState } from "react";
import { Modal, Pressable, StyleSheet } from "react-native";

import { Heading } from "@/shared/components/ui/heading";
import { ChevronDownIcon, Icon } from "@/shared/components/ui/icon";
import { Text } from "@/shared/components/ui/text";
import { VStack } from "@/shared/components/ui/vstack";

type SelectFieldProps = {
    label: string;
    required?: boolean;
    value: string;
    placeholder: string;
    options: string[];
    onChange: (value: string) => void;
};

export function SelectField({
    label,
    required = false,
    value,
    placeholder,
    options,
    onChange,
}: SelectFieldProps) {
    const [open, setOpen] = useState(false);

    return (
        <VStack className="gap-2">
            <Text className="text-sm font-medium text-foreground">
                {label}
                {required ? <Text className="text-destructive"> *</Text> : null}
            </Text>
            <Pressable
                onPress={() => setOpen(true)}
                className="h-12 flex-row items-center justify-between rounded-xl border border-input bg-white px-3"
            >
                <Text className={value ? "text-foreground" : "text-muted-foreground"}>
                    {value || placeholder}
                </Text>
                <Icon as={ChevronDownIcon} size="sm" className="text-muted-foreground" />
            </Pressable>

            <Modal
                visible={open}
                transparent
                animationType="fade"
                onRequestClose={() => setOpen(false)}
            >
                <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
                    <Pressable style={styles.sheet} onPress={() => undefined}>
                        <Heading size="md" className="mb-3">
                            {label}
                        </Heading>
                        <VStack className="gap-2">
                            {options.map((option) => (
                                <Pressable
                                    key={option}
                                    onPress={() => {
                                        onChange(option);
                                        setOpen(false);
                                    }}
                                    className={`rounded-xl px-4 py-3 ${
                                        option === value ? "bg-primary/10" : "bg-background"
                                    }`}
                                >
                                    <Text
                                        className={
                                            option === value
                                                ? "font-medium text-primary"
                                                : "text-foreground"
                                        }
                                    >
                                        {option}
                                    </Text>
                                </Pressable>
                            ))}
                        </VStack>
                    </Pressable>
                </Pressable>
            </Modal>
        </VStack>
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
        paddingTop: 20,
        paddingBottom: 28,
    },
});
