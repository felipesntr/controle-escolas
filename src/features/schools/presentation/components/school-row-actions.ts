import type { RowAction } from "@/shared/components/actions-menu";
import { EditIcon, EyeIcon, TrashIcon } from "@/shared/components/ui/icon";

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
