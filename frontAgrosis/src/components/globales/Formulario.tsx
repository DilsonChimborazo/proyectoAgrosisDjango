import React from 'react';
import Button from '../globales/Button';

interface FormField {
    id: string;
    label: string;
    type: string;
    options?: string[];
    value?: string;
}

interface FormProps {
    fields: FormField[];
    onSubmit: (formData: { [key: string]: string }) => void;
}

const Formulario: React.FC<FormProps> = ({ fields, onSubmit }) => {
    const [formData, setFormData] = React.useState<{ [key: string]: string }>({});

    const handleChange = (id: string, value: string) => {
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSubmit(formData);
    };

    const handleButtonClick = () => {
        console.log('Detalles del formulario:', formData);
        // Aquí puedes agregar cualquier acción adicional que necesites
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 rounded-lg shadow-lg">
            {fields.map((field) => (
                <div key={field.id} className="mb-4">
                    <label htmlFor={field.id} className="block mb-2 font-bold">
                        {field.label}
                    </label>
                    {field.type === 'select' ? (
                        <select
                            id={field.id}
                            className="w-full p-2 border border-gray-300 rounded"
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            value={formData[field.id] || field.value || ''}
                        >
                            {field.options?.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type={field.type}
                            id={field.id}
                            className="w-full p-2 border border-gray-300 rounded"
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            value={formData[field.id] || field.value || ''}
                        />
                    )}
                </div>
            ))}
            <div className='flex justify-center items-center'>
                <Button text="Registrarse" onClick={handleButtonClick} variant="success" />
            </div>
        </form>
    );
};

export default Formulario;
