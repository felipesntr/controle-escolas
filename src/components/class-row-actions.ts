import type { RowAction } from "@/components/actions-menu";
import { EditIcon, TrashIcon } from "@/components/ui/icon";

type ClassRowActionHandlers = {
    onEdit: () => void;
    onDelete: () => void;
};

export function createClassRowActions(
    handlers: ClassRowActionHandlers
): RowAction[] {
    return [
        {
            id: "edit",
            label: "Editar",
            icon: EditIcon,
            onPress: handlers.onEdit,
        },
        {
            id: "delete",
            label: "Excluir",
            icon: TrashIcon,
            destructive: true,
            onPress: handlers.onDelete,
        },
    ];
}
