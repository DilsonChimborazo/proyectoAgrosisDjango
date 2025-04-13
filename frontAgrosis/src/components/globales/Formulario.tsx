import React from 'react';
import Button from '../globales/Button';

interface FormField {
    id: string;
    label: string;
    type: string;
    options?: { value: string | number; label: string }[];
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface FormProps {
    fields: FormField[];
    onSubmit: (formData: { [key: string]: string | File }) => void;
    isError?: boolean;
    isSuccess?: boolean;
    title: string;
    initialValues?: { [key: string]: string | File };
    multipart?: boolean;
    onExtraButtonClick?: () => void; // Añadido para el botón extra
    extraButtonTitle?: string; // Título del botón extra
}

const Formulario: React.FC<FormProps> = ({
    fields,
    onSubmit,
    isError,
    isSuccess,
    title,
    initialValues,
    multipart,
    onExtraButtonClick,
    extraButtonTitle = 'Botón Extra', // Valor por defecto
}) => {
    const [formData, setFormData] = React.useState<{ [key: string]: string | File }>(
        initialValues || {}
    );

    React.useEffect(() => {
        setFormData(initialValues || {});
    }, [initialValues]);

    const handleChange = (id: string, value: string | File) => {
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSubmit(formData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-5xl mx-auto bg-white p-6 rounded-3xl"
            encType={multipart ? 'multipart/form-data' : ''}
        >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">{title}</h2>
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
                            value={formData[field.id] as string || ''}
                        >
                            <option value="">Seleccione una opción</option>
                            {field.options?.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    ) : field.type === 'file' ? (
                        <input
                            type="file"
                            id={field.id}
                            className="w-full p-2 border border-gray-300 rounded"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    handleChange(field.id, file);
                                }
                                if (field.onChange) {
                                    field.onChange(e);
                                }
                            }}
                            accept="image/*"
                        />
                    ) : (
                        <input
                            type={field.type}
                            id={field.id}
                            className="w-full p-2 border border-gray-300 rounded"
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            value={formData[field.id] as string || ''}
                            placeholder={`Ingrese ${field.label.toLowerCase()}`}
                        />
                    )}
                </div>
            ))}

            {isError && (
                <div className="text-red-500 mt-4 mb-4 flex justify-center items-center">
                    Error al enviar el formulario
                </div>
            )}
            {isSuccess && (
                <div className="text-green-500 mt-4 mb-4 flex justify-center items-center">
                    Enviado exitosamente
                </div>
            )}
            <div className="flex justify-center items-center mt-8">
                <Button text="registrar" className="mx-2" variant="success" onClick={() => {}} />
                {onExtraButtonClick && (
                    <Button
                        text={extraButtonTitle} // Cambié 'title' por 'text'
                        className="mx-2"
                        variant="success"
                        onClick={onExtraButtonClick}
                    />
                )}
            </div>
        </form>
    );
};

export default Formulario;
