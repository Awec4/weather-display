import './WeatherDisplayIcon.css';
import { WeatherCode } from './WeatherCode';

interface IWeatherDisplayIconProps {
    className: string;
    weatherCode: WeatherCode;
}

function getIconNameForWeatherCode(code: WeatherCode): string {
    switch (code) {
        case WeatherCode.CLOUDY:
            return `${CLASS_NAME}__cloudy`;
        case WeatherCode.DRIZZLE:
            return `${CLASS_NAME}__drizzle`;
        case WeatherCode.FOG:
            return `${CLASS_NAME}__fog`;
        case WeatherCode.RAIN:
            return `${CLASS_NAME}__rain`;
        case WeatherCode.RAIN_SHOWERS:
            return `${CLASS_NAME}__rain-showers`;
        case WeatherCode.SNOW:
            return `${CLASS_NAME}__snow`;
        case WeatherCode.SNOW_SHOWERS:
            return `${CLASS_NAME}__snow-showers`;
        case WeatherCode.THUNDERSTORM:
            return `${CLASS_NAME}__thunderstorm`;
        case WeatherCode.CLEAR:
        default:
            return `${CLASS_NAME}__clear`;
    }
}

const CLASS_NAME: string = "weather-display-icon";

const WeatherDisplayIcon: React.FC<IWeatherDisplayIconProps> = (props: IWeatherDisplayIconProps) => {
    return <div className={`${CLASS_NAME} ${props.className} ${getIconNameForWeatherCode(props.weatherCode)}`} />
}



export default WeatherDisplayIcon;