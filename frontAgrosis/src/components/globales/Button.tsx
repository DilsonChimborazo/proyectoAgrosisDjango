import React from "react";

interface ButtonProps {
    text: string;
    onClick: () => void;
    variant?: "success" | "primary" | "danger"; 
    className?: string; 
}

const Button: React.FC<ButtonProps> = ({ text, onClick, variant = "primary", className }) => {
    const baseStyles =
        "px-4 py-2 rounded-lg font-semibold shadow-md transition duration-300 ease-in-out transform hover:scale-105";

    const variantStyles = {
        success: "bg-green-700 text-white hover:bg-green-600", 
        primary: "bg-blue-500 text-white hover:bg-blue-600", 
        danger: "bg-red-500 text-white hover:bg-red-600", 
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
            {text}
        </button>
    );
};

export default Button;
