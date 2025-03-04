import React from 'react';
import './App.css';
import { IWeather } from './IWeather';
import WeatherDisplay from './WeatherDisplay';
import { getWeathers } from './FetchUtils';

function App() {
  const [weathers, setWeathers] = React.useState<ReadonlyArray<IWeather>>([]);
  function onSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      getWeathers((e.target as HTMLInputElement).value).then(setWeathers);
    }
  }

  return (
    <div className="App">
      <p className="app-header">
        Weather App
      </p>
      <input className="app-search-input" onKeyDown={onSearch} placeholder='Enter a location'/>
      <div className="app-body">
        {weathers.map((weather: IWeather) => <WeatherDisplay weather={weather} />)}
      </div>
    </div>
  );
}

export default App;
