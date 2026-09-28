import {
    Toast,
    ToastDescription,
    ToastTitle,
    useToast,
} from "@/components/ui/toast";

type FeedbackAction = "success" | "error" | "warning" | "info" | "muted";

export function useFeedbackToast() {
    const toast = useToast();

    return (
        title: string,
        description: string,
        action: FeedbackAction = "success"
    ) => {
        toast.show({
            placement: "top",
            duration: 3000,
            render: ({ id }) => (
                <Toast nativeID={id} action={action} variant="solid">
                    <ToastTitle size="sm">{title}</ToastTitle>
                    <ToastDescription size="sm">{description}</ToastDescription>
                </Toast>
            ),
        });
    };
}
