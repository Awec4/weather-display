import { WeatherCode } from "./WeatherCode";

export interface IWeather {
  date: string;
  condition: WeatherCode;
  temperature: number;
  windSpeed: number;
}