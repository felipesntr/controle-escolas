import type { RowAction } from "@/components/actions-menu";
import { EditIcon, EyeIcon, TrashIcon } from "@/components/ui/icon";

type SchoolRowActionHandlers = {
    onView: () => void;
    onEdit: () => void;
    onDelete: () => void;
};

export function createSchoolRowActions(
    handlers: SchoolRowActionHandlers
): RowAction[] {
    return [
        {
            id: "view",
            label: "Ver",
            icon: EyeIcon,
            onPress: handlers.onView,
        },
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
