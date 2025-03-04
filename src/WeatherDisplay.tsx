import './WeatherDisplay.css';
import { IWeather } from "./IWeather";

interface IWeatherDisplayProps {
    weather: IWeather;
}

const WeatherDisplay: React.FC<IWeatherDisplayProps> = (props: IWeatherDisplayProps) => {
    const {weather} = props;
    return <div className='weather-display'>
        <div className='weather-display_date'>{weather.date} {weather.day}</div>
        <div className='weather-display_icon'>{weather.condition}</div>
        <div className='weather-display_condition'>{weather.condition}</div>
        <div className='weather-display_temperature'>{weather.temperature}</div>
        <div className='weather-display_windSpeed'>{weather.windSpeed}</div>
    </div>
}



export default WeatherDisplay;