// src/api/apiLunar.ts
import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export async function obtenerFaseLunar(fecha: string): Promise<string> {
  const url = `https://api.weatherapi.com/v1/astronomy.json?key=${API_KEY}&q=Bogota&dt=${fecha}`;
  try {
    const res = await axios.get(url);
    return res.data.astronomy.astro.moon_phase;
  } catch (error) {
    console.error('Error obteniendo la fase lunar:', error);
    return 'Desconocida';
  }
}
