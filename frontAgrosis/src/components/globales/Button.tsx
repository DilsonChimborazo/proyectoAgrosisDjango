import React from "react";
import { LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    variant?: "danger" | "success" | "warning" | "green" | "primary" | "outline";
    size?: "xs" | "sm" | "md" | "lg";
    onClick?: () => void;
    className?: string;
    icon?: LucideIcon;
    iconPosition?: "left" | "right";
}

const Button: React.FC<ButtonProps> = ({ 
    text, 
    variant = "success", 
    size = "md",
    className, 
    icon: Icon,
    iconPosition = "left",
    ...props 
}) => {
    const baseStyles = "px-4 py-2 mx-2 border rounded-lg font-semibold transition duration-300 flex items-center justify-center gap-2";

    const sizeStyles = {
        xs: "text-xs px-2 py-1",
        sm: "text-sm px-3 py-1.5",
        md: "text-base px-4 py-2",
        lg: "text-lg px-6 py-3"
    };

    const variantStyles = {
        success: "text-green-700 border-green-700 hover:text-white hover:bg-green-800",
        danger: "text-red-700 border-red-700 hover:text-white hover:bg-red-800",
        warning: "text-yellow-400 border-yellow-400 hover:text-white hover:bg-yellow-500",
        green: "text-white border-0 bg-green-800 hover:bg-green-900",
        primary: "text-white border-0 bg-blue-600 hover:bg-blue-700",
        outline: "bg-transparent border border-gray-300 hover:bg-gray-50"
    };

    return (
        <button
            className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {Icon && iconPosition === "left" && <Icon size={16} />}
            {text}
            {Icon && iconPosition === "right" && <Icon size={16} />}
        </button>
    );
};

export default Button;