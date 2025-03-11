import React from 'react';
import 'swiper/css';

const HomeInicio: React.FC = () => {
    return (
        <div className="w-full h-screen py-60 ">
            {/* Título de bienvenida */}
            <div className="bg-black bg-opacity-70 text-center py-4 px-6 rounded-lg">
                <h1 className="text-9xl font-bold text-white">¡Bienvenido Agricultor!</h1>
                <p className="text-4xl p-3 text-white mt-2">Agricultura inteligente para un planeta en armonía.</p>
            </div>
        </div>
    );
};

export default HomeInicio;
