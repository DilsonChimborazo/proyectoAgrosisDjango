import { addToast } from "@heroui/react";

interface ToastOptions {
  title: string;
  description?: string;
  timeout?: number;
  hideIcon?: boolean;
}

export const Toast = ({ title, description, hideIcon = false }: ToastOptions) => {
  <div className="pt-40 text-success">
    <h3 className="">{title}</h3>
    {description && <p>{description}</p>}
    <button onClick={() => addToast({ title: "Toast Cerrado", timeout: 3000 })}>Cerrar</button>
    {hideIcon && <span style={{ marginLeft: "10px" }}>��</span>}
  </div>
};