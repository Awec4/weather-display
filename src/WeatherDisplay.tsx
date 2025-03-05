import './WeatherDisplay.css';
import { IWeather } from "./IWeather";
import { WeatherCode } from './WeatherCode';
import WeatherDisplayIcon from './WeatherDisplayIcon';
import { tempUnit, windSpeedUnit } from './constants';

interface IWeatherDisplayProps {
    weather: IWeather;
}

function getConditionForWeatherCode(code: WeatherCode): string {
    switch (code) {
        case WeatherCode.CLOUDY:
            return "Cloudy";
        case WeatherCode.DRIZZLE:
            return "Drizzle";
        case WeatherCode.FOG:
            return "Foggy";
        case WeatherCode.RAIN:
            return "Rain";
        case WeatherCode.RAIN_SHOWERS:
            return "Rain Showers";
        case WeatherCode.SNOW:
            return "Snow";
        case WeatherCode.SNOW_SHOWERS:
            return "Snow Showers";
        case WeatherCode.THUNDERSTORM:
            return "Thunderstorm";
        case WeatherCode.CLEAR:
        default:
            return "Clear";
    }
}

const WeatherDisplay: React.FC<IWeatherDisplayProps> = (props: IWeatherDisplayProps) => {
    const {weather} = props;
    const displayDate: string = new Date(weather.date).toLocaleDateString("en-gb", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    
    return <div className='weather-display'>
        <div className='weather-display_date'>{displayDate}</div>
        <WeatherDisplayIcon className={"weather-display_icon"} weatherCode={weather.condition} />
        <div className='weather-display_condition'>{getConditionForWeatherCode(weather.condition)}</div>
        <div className='weather-display_temperature'>{weather.temperature} {tempUnit}</div>
        <div className='weather-display_windSpeed'>{weather.windSpeed} {windSpeedUnit}</div>
    </div>
}



export default WeatherDisplay;