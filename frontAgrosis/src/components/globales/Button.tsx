import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    variant?: "success" | "primary" | "danger" | "warning" ; 
}

const Button: React.FC<ButtonProps> = ({ text, variant = "primary", className, ...props }) => {
    const baseStyles =
        "px-4 py-2 rounded-lg font-semibold shadow-md transition duration-300 ease-in-out transform hover:scale-105";

    const variantStyles = {
        success: "bg-green-700 text-white hover:bg-green-600", 
        primary: "bg-blue-500 text-white hover:bg-blue-600", 
        danger: "bg-red-500 text-white hover:bg-red-600", 
        warning: "bg-yellow-500 text-white hover:bg-yellow-600",  
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            {...props} 
        >
            {text}
        </button>
    );
};

export default Button;
