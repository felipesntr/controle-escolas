import { Button, ButtonIcon, ButtonText } from "@/shared/components/ui/button";
import { HStack } from "@/shared/components/ui/hstack";
import { ChevronLeftIcon, ChevronRightIcon } from "@/shared/components/ui/icon";
import { Text } from "@/shared/components/ui/text";

type TablePaginationProps = {
    page: number;
    pageCount: number;
    onPageChange: (page: number) => void;
};

export function TablePagination({
    page,
    pageCount,
    onPageChange,
}: TablePaginationProps) {
    return (
        <HStack className="mt-4 items-center justify-between">
            <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onPress={() => onPageChange(page - 1)}
            >
                <ButtonIcon as={ChevronLeftIcon} />
                <ButtonText>Anterior</ButtonText>
            </Button>

            <Text className="text-sm text-typography-500">
                Página {page} de {pageCount}
            </Text>

            <Button
                size="sm"
                variant="outline"
                disabled={page >= pageCount}
                onPress={() => onPageChange(page + 1)}
            >
                <ButtonText>Próxima</ButtonText>
                <ButtonIcon as={ChevronRightIcon} />
            </Button>
        </HStack>
    );
}
