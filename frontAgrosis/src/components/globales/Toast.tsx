import {addToast} from "@heroui/react";

interface ToastOptions {
  title: string;
  description?: string;
  timeout?: number;
  hideIcon?: boolean;
  variant?: "success" | "error" | "info";
}

const getClasses = (variant: ToastOptions["variant"]) => {
  switch (variant) {
    case "error":
      return {
        textColor: "text-white",
        bgColor: "bg-red-500",
      };
    case "info":
      return {
        textColor: "text-white",
        bgColor: "bg-sky-500", 
      };
    case "success":
    default:
      return {
        textColor: "text-white",
        bgColor: "bg-green-600",
      };
  }
};

export const showToast = ({
  title,
  description,
  timeout = 4000,
  variant = "success",
}: ToastOptions) => {
  const styles = getClasses(variant);

  addToast({
    title: (
      <div className={`flex items-center font-bold text-md ${styles.textColor}`}>
        <span>{title}</span>
      </div>
    ),
    description: description ? (
      <div className="text-gray-200 text-md mt-1">{description}</div>
    ) : undefined,
    timeout,
    classNames: {
      base: `${styles.bgColor} text-white rounded-3xl`,
      title: "text-white",
      description: "text-gray-200",
    },
  });
};
