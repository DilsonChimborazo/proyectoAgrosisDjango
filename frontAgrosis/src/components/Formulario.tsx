import React, { FormEvent } from "react";

interface FormContainerProps {
  title: string;
  children: React.ReactNode;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  className?: string;
}

const Formulario: React.FC<FormContainerProps> = ({ title, children, onSubmit, className }) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  return (
    <div className={`flex justify-center items-center min-h-screen ${className}`}>
      <div className="w-full max-w-md shadow-lg rounded-2xl bg-white p-8">
        <h1 id="form-title" className="text-center text-2xl font-bold text-gray-900">
          {title}
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit} aria-labelledby="form-title">
          {children}
        </form>
      </div>
    </div>
  );
};

export default Formulario;
