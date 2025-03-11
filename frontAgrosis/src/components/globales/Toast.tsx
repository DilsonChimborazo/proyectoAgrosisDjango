import { addToast } from "@heroui/toast";

export const showToast = (title: string, description?: string) => {
    addToast({
        title,
        description,
        timeout: 5000,
    });
};
