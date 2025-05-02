import React from 'react';
import Button from '../globales/Button';

interface FormField {
    id: string;
    label: string;
    type: string;
    options?: { value: string | number; label: string }[];
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    hasExtraButton?: boolean;
    extraButtonText?: string;
    onExtraButtonClick?: () => void;
}

interface FormProps {
    fields: FormField[];
    onSubmit: (formData: { [key: string]: string | File }) => void;
    isError?: boolean;
    isSuccess?: boolean;
    title: string;
    initialValues?: { [key: string]: string | File };
    multipart?: boolean;
    onExtraButtonClick?: () => void;
    extraButtonTitle?: string;
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
    extraButtonTitle = 'Botón Extra',
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
                <div key={field.id} className="mb-6">
                    {field.type === 'select' ? (
                        <div>
          <label htmlFor={field.id} className="block mb-2 font-bold">
            {field.label}
          </label>
          <select
            id={field.id}
            className="w-full p-2 border border-gray-300 rounded"
            onChange={(e) => handleChange(field.id, e.target.value)}
            value={(formData[field.id] as string) || ''}
          >
            <option value="">Seleccione una opción</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {field.hasExtraButton && (
            <button
              type="button"
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
              onClick={field.onExtraButtonClick}
            >
              {field.extraButtonText || 'Agregar nueva opción'}
            </button>
          )}
        </div>
      ) : field.type === 'file' ? (
        <div>
          <label htmlFor={field.id} className="block mb-2 font-bold">
            {field.label}
          </label>
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
        </div>
      ) : (
        <div className="relative w-full">
          <input
            type={field.type}
            id={field.id}
            value={(formData[field.id] as string) || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder=" "
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          />
          <label
            htmlFor={field.id}
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
          >
            {field.label}
          </label>
        </div>
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
        text={extraButtonTitle}
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