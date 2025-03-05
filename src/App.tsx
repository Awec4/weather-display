import React from 'react';
import './App.css';
import { IWeather } from './IWeather';
import WeatherDisplay from './WeatherDisplay';
import { getWeathers } from './FetchUtils';

interface IAppState {
  weathers: ReadonlyArray<IWeather>;
  errorMessage: string;
}

function App() {
  const [{weathers, errorMessage}, setState] = React.useState<IAppState>({weathers: [], errorMessage: ""})

  function onSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      getWeathers((e.target as HTMLInputElement).value)
        .then((weathers) => setState({weathers, errorMessage: ""}))
        .catch((errorMessage: string) => setState({weathers: [], errorMessage}));
    }
  }

  return (
    <div className="App">
      <p className="app-header">
        Weather App
      </p>
      <input className="app-search-input" onKeyDown={onSearch} placeholder='Enter a location'/>
      <div className="app-error-msg">{errorMessage}</div>
      <div className="app-body">
        {weathers.map((weather: IWeather) => <WeatherDisplay key={weather.date} weather={weather} />)}
      </div>
    </div>
  );
}

export default App;
