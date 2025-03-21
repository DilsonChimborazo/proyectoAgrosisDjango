import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    variant?: "danger" | "success" | "warning" |"green";
    onClick: () => void;
    className?: string; 

}

const Button: React.FC<ButtonProps> = ({ text, variant = "success", className, ...props }) => {
    const baseStyles = "px-4 py-2 mx-2 border rounded-lg font-semibold transition duration-300";

    const variantStyles = {
        success: "text-green-700 border-green-700 hover:text-white hover:bg-green-800",
        danger: "text-red-700 border-red-700 hover:text-white hover:bg-red-800",
        warning: "text-yellow-400 border-yellow-400 hover:text-white hover:bg-yellow-500",
        green: "text-white border-0 bg-green-800 hover:text-white bg-green-800",

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
