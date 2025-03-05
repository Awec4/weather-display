import {
  forecastDays,
  tempUnit,
  windSpeedUnit
} from "./constants";
import { IWeather } from "./IWeather";
import { WeatherCode } from "./WeatherCode";
import { WMOWeatherCode } from "./WMOWeatherCode";

const apiKeySearch: string = "https://geocoding-api.open-meteo.com/v1/search";
const apiKeyForecast: string = "https://api.open-meteo.com/v1/forecast";
const weatherProps: string = "daily=temperature_2m_max,wind_speed_10m_max,weather_code";

interface ISearchResults {
    results: ReadonlyArray<ILocation> | undefined;
}

interface ILocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

interface IWeatherResponse {
  daily: IDailyWeatherResponse;
}

interface IDailyWeatherResponse {
    temperature_2m_max: ReadonlyArray<number>;
    time: ReadonlyArray<string>;
    wind_speed_10m_max: ReadonlyArray<number>;
    weather_code: ReadonlyArray<WMOWeatherCode>;
}

export async function getWeathers(searchText: string): Promise<ReadonlyArray<IWeather>> {
    const searchRes: ISearchResults = await fetchLocation(searchText);
    if (searchRes.results === undefined || searchRes.results.length === 0) {
        throw "Error: results not found";
    }
    
    const weatherRes: IWeatherResponse = await fetchWeathers(searchRes.results[0]);
    if (weatherRes.daily === undefined || weatherRes.daily.time.length === 0) {
        throw "Error: weather not found";
    }
    
    return handleWeatherResponse(weatherRes.daily);
}

async function fetchLocation(searchText: string): Promise<ISearchResults> {
    console.log(searchText);
    return fetch(`${apiKeySearch}?name=${searchText}&count=10&language=en&format=json`,
      {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              
          }
      }).then((response: Response) => {
        if (response.status == 200) {
          console.log(response);
          return response.json();
        }
        else
        {
            throw `error with status ${response.status}`;
        }
    });
}

async function fetchWeathers(location: ILocation): Promise<IWeatherResponse> {
    return fetch(`${apiKeyForecast}?latitude=${location.latitude}&longitude=${location.longitude}&forecast_days=${forecastDays}&temperature_unit=${tempUnit}&wind_speed_unit=${windSpeedUnit}&${weatherProps}`,
      {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              
          }
      }).then((response: Response) => {
        if (response.status == 200) {   // *** This can be just `if (response.ok) {`
          console.log(response);      // *** This is premature
          return response.json();
        }
        else
        {
            throw `error with status ${response.status}`;
        }
    });
}
  

function handleWeatherResponse(res: IDailyWeatherResponse): ReadonlyArray<IWeather> {
    const retVal: Array<IWeather> = [];
      for (let i = 0; i < 5; i++) {
        retVal.push({
          date: res.time[i],
          condition: mapWMOWeatherCodeToWeatherCode(res.weather_code[i]),
          temperature: res.temperature_2m_max[i],
          windSpeed: res.wind_speed_10m_max[i],
        })
      }
    return retVal;
}

function mapWMOWeatherCodeToWeatherCode(code: WMOWeatherCode): WeatherCode {
  switch (code){
    case WMOWeatherCode.CLOUDY:
    case WMOWeatherCode.OVERCAST:
      return WeatherCode.CLOUDY;
    case WMOWeatherCode.FOG:
    case WMOWeatherCode.RIME_FOG:
      return WeatherCode.FOG;
    case WMOWeatherCode.DRIZZLE_LIGHT:
    case WMOWeatherCode.DRIZZLE_MODERATE:
    case WMOWeatherCode.DRIZZLE_DENSE:
    case WMOWeatherCode.FREEZING_DRIZZLE_LIGHT:
    case WMOWeatherCode.FREEZING_DRIZZLE_DENSE:
      return WeatherCode.DRIZZLE;
    case WMOWeatherCode.RAIN_LIGHT:
    case WMOWeatherCode.RAIN_MODERATE:
    case WMOWeatherCode.RAIN_HEAVY:
    case WMOWeatherCode.FREEZING_RAIN_LIGHT:
    case WMOWeatherCode.FREEZING_RAIN_HEAVY:
      return WeatherCode.DRIZZLE;
    case WMOWeatherCode.SNOW_FALL_LIGHT:
    case WMOWeatherCode.SNOW_FALL_MODERATE:
    case WMOWeatherCode.SNOW_FALL_HEAVY:
    case WMOWeatherCode.SNOW_GRAINS:
      return WeatherCode.SNOW;
    case WMOWeatherCode.RAIN_SHOWERS_LIGHT:
    case WMOWeatherCode.RAIN_SHOWERS_MODERATE:
    case WMOWeatherCode.RAIN_SHOWERS_VIOLENT:
      return WeatherCode.RAIN_SHOWERS;
    case WMOWeatherCode.SNOW_SHOWERS_LIGHT:
    case WMOWeatherCode.SNOW_SHOWERS_HEAVY:
      return WeatherCode.SNOW_SHOWERS;
    case WMOWeatherCode.THUNDERSTORM:
    case WMOWeatherCode.THUNDERSTORM_HAIL_LIGHT:
    case WMOWeatherCode.THUNDERSTORM_HAIL_HEAVY:
      return WeatherCode.THUNDERSTORM;
    case WMOWeatherCode.CLEAR:
    case WMOWeatherCode.MOSTLY_CLEAR:
    default:
      return WeatherCode.CLEAR;
  }
}