import React from 'react';

const HomeInicio: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 w-full h-screen">
            <div className=" p-6 rounded-lg shadow-md flex flex-col justify-center items-center">
                <h2 className="text-xl font-semibold text-black bg-white rounded-full px-10 mb-4">Mapa</h2>
                <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                    <span className="text-gray-600">Mapa de ubicación</span>
                </div>
            </div>
            <div className=" p-6 rounded-lg shadow-md flex flex-col justify-center items-center">
                <h2 className="text-xl font-semibold text-black bg-white rounded-full px-10 mb-4">Calendario</h2>
                <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                    <span className="text-gray-600">Calendario de actividades</span>
                </div>
            </div>
            <div className=" p-6 rounded-lg shadow-md flex flex-col justify-center items-center">
                <h2 className="text-xl font-semibold text-black bg-white rounded-full px-10 mb-4">Datos de Sensores</h2>
                <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                    <span className="text-gray-600">Datos actuales de los sensores</span>
                </div>
            </div>
            <div className=" p-6 rounded-lg shadow-md flex flex-col justify-center items-center">
                <h2 className="text-xl font-semibold text-black bg-white rounded-full px-10 mb-4">Datos Meteorológicos del Día</h2>
                <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                    <span className="text-gray-600">Información del clima</span>
                </div>
            </div>
        </div>
    );
};

export default HomeInicio;
