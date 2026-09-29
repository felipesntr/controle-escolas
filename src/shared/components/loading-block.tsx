import { useEffect, useState } from "react";

import { Progress, ProgressFilledTrack } from "@/shared/components/ui/progress";
import { Spinner } from "@/shared/components/ui/spinner";
import { Text } from "@/shared/components/ui/text";
import { VStack } from "@/shared/components/ui/vstack";

export function LoadingBlock({ label }: { label: string }) {
    const [value, setValue] = useState(18);

    useEffect(() => {
        const timer = setInterval(() => {
            setValue((current) => (current >= 88 ? 22 : current + 11));
        }, 350);

        return () => clearInterval(timer);
    }, []);

    return (
        <VStack className="w-full items-center gap-3">
            <Spinner size="large" />
            <Progress value={value} className="w-full">
                <ProgressFilledTrack />
            </Progress>
            <Text className="text-typography-500">{label}</Text>
        </VStack>
    );
}
