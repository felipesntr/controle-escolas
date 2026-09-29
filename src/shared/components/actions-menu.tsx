import type { ElementType } from "react";

import { Button, ButtonIcon } from "@/shared/components/ui/button";
import { Icon, MenuIcon } from "@/shared/components/ui/icon";
import {
    Menu,
    MenuItem,
    MenuItemLabel,
    MenuSeparator,
} from "@/shared/components/ui/menu";

export type RowAction = {
    id: string;
    label: string;
    icon: ElementType;
    destructive?: boolean;
    onPress: () => void;
};

type ActionsMenuProps = {
    actions: RowAction[];
};

export function ActionsMenu({ actions }: ActionsMenuProps) {
    return (
        <Menu
            placement="bottom right"
            trigger={(triggerProps) => (
                <Button
                    {...triggerProps}
                    size="sm"
                    variant="outline"
                    accessibilityLabel="Ações"
                >
                    <ButtonIcon as={MenuIcon} />
                </Button>
            )}
        >
            {actions.flatMap((action, index) => {
                const item = (
                    <MenuItem
                        key={action.id}
                        textValue={action.label}
                        onPress={action.onPress}
                    >
                        <Icon
                            as={action.icon}
                            size="sm"
                            className={
                                action.destructive
                                    ? "mr-2 text-destructive"
                                    : "mr-2 text-foreground"
                            }
                        />
                        <MenuItemLabel
                            className={
                                action.destructive
                                    ? "text-destructive"
                                    : undefined
                            }
                        >
                            {action.label}
                        </MenuItemLabel>
                    </MenuItem>
                );

                if (index === 0) {
                    return [item];
                }

                return [
                    <MenuSeparator key={`${action.id}-separator`} />,
                    item,
                ];
            })}
        </Menu>
    );
}
