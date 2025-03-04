import { IWeather } from "./IWeather";

const apiKeySearch: string = "https://geocoding-api.open-meteo.com/v1/search";
const apiKeyForecast: string = "https://api.open-meteo.com/v1/forecast";

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
    return fetch(`${apiKeyForecast}?latitude=${location.latitude}&longitude=${location.longitude}&daily=temperature_2m_max,wind_speed_10m_max`,
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
          day: "",
          condition: "",
          temperature: res.temperature_2m_max[i],
          windSpeed: res.wind_speed_10m_max[i],
        })
      }
    return retVal;
}