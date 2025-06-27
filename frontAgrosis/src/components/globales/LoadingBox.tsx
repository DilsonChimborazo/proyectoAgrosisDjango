import { Spinner } from "@heroui/react";

const LoadingBox = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-90 z-50">
      <div className="bg-white shadow-lg rounded-2xl border border-green-200 p-6 flex flex-col items-center space-y-4">
        <Spinner color="success" labelColor="success" />
        <p className="text-sm text-gray-600">Por favor, espera un momento.</p>
      </div>
    </div>
  );
};

export default LoadingBox;