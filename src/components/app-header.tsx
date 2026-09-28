import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, ButtonIcon } from "@/components/ui/button";
import { ArrowLeftIcon } from "@/components/ui/icon";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";

type AppHeaderProps = {
    options: {
        title?: string;
        headerRight?: (props: { canGoBack: boolean }) => React.ReactNode;
    };
    back?: unknown;
    navigation: {
        goBack: () => void;
    };
};

export const screenBackground = "#ffffff";

export const gluestackStackOptions = {
    header: (props: AppHeaderProps) => <AppHeader {...props} />,
    headerShadowVisible: false,
    contentStyle: {
        backgroundColor: screenBackground,
    },
};

export function AppHeader({ options, back, navigation }: AppHeaderProps) {
    const insets = useSafeAreaInsets();
    const canGoBack = Boolean(back);

    return (
        <VStack
            className="border-b border-border bg-background"
            style={{ paddingTop: insets.top }}
        >
            <HStack className="h-14 items-center px-2">
                <HStack className="w-24">
                    {canGoBack ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            accessibilityLabel="Voltar"
                            onPress={navigation.goBack}
                        >
                            <ButtonIcon as={ArrowLeftIcon} />
                        </Button>
                    ) : null}
                </HStack>

                <Heading
                    size="md"
                    className="flex-1 text-center"
                    numberOfLines={1}
                >
                    {options.title}
                </Heading>

                <HStack className="w-24 items-center justify-end">
                    {options.headerRight?.({ canGoBack })}
                </HStack>
            </HStack>
        </VStack>
    );
}
