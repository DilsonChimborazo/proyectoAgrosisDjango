import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const HomeInicio: React.FC = () => {
    return (
        <div className="w-full h-screen flex flex-col">
            {/* Título de bienvenida */}
            <div className="bg-black bg-opacity-30 text-center py-4">
                <h1 className="text-6xl font-bold text-white">¡Bienvenido Agricultor!</h1>
                <p className="text-4xl p-3 text-white mt-2">Agricultura inteligente para un planeta en armonía.</p>
            </div>

            {/* Diseño del contenido principal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-full p-4">
                {/* Contenedor izquierdo (Datos Meteorológicos y Datos Sensores) */}
                <div className="p-6 rounded-3xl shadow-md flex flex-col bg-white h-full">
                    <h2 className="text-xl font-semibold text-center mb-4">Datos del Clima y Sensores</h2>
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={1}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        modules={[Autoplay]}
                        className="w-full h-full"
                    >
                        <SwiperSlide>
                            <div className="flex flex-col justify-center items-center h-full">
                                <h3 className="text-lg font-semibold mb-2">Datos Meteorológicos</h3>
                                <img
                                    src="../../../public/datos_meteorologicos.png"
                                    alt="Clima"
                                    className="rounded-lg w-full h-full object-fill"
                                />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="flex flex-col justify-center items-center h-full">
                                <h3 className="text-lg font-semibold mb-2">Datos Sensores</h3>
                                <img
                                    src="../../../public/sensores.jpg"
                                    alt="Sensores"
                                    className="rounded-lg w-full h-full object-fill"
                                />
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="p-6 rounded-3xl shadow-md flex flex-col bg-white">
                        <h2 className="text-xl font-semibold text-center mb-4">Calendario</h2>
                        <Swiper
                            spaceBetween={20}
                            slidesPerView={1}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                            modules={[Autoplay]}
                            className="w-full h-80"
                        >
                            <SwiperSlide>
                                <img
                                    src="../../../public/calen.avif"
                                    alt="Calendario"
                                    className="rounded-lg w-full h-full object-fill"
                                />
                            </SwiperSlide>
                        </Swiper>
                    </div>

                    {/* Mapa */}
                    <div className="p-6 rounded-3xl shadow-md flex flex-col bg-white">
                        <h2 className="text-xl font-semibold text-center mb-4">Mapa</h2>
                        <Swiper
                            spaceBetween={20}
                            slidesPerView={1}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                            modules={[Autoplay]}
                            className="w-full h-80"
                        >
                            <SwiperSlide>
                                <img
                                    src="../../../public/map.jpg"
                                    alt="Mapa"
                                    className="rounded-lg w-full h-full object-fill"
                                />
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeInicio;
