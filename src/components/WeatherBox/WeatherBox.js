import React, { useCallback, useState, useEffect } from 'react';
import PickCity from '../PickCity/PickCity';
import WeatherSummary from '../WeatherSummary/WeatherSummary';
import Loader from '../Loader/Loader';
import ErrorBox from '../ErrorBox/ErrorBox';

const WeatherBox = () => {
  const [cityName, setCityName] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleCityChange = useCallback((city) => {
    console.log('Selected city:', city);
    setCityName(city);
    setIsPending(true);
    setIsLoading(true);
    setHasError(false);

    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=59503e66fb2aa31df5ad1e93a243445f&units=metric`)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        setHasError(true);
      }
    })
    .then((data) => {
      console.log(data);
      const weatherData = data ? {
        city: data.name,
        temp: data.main.temp,
        icon: data.weather[0].icon,
        description: data.weather[0].main,
      } : null;
      setWeatherData(weatherData);
      setIsPending(false);
      setIsLoading(false);
    })
}, []);

useEffect(() => {
  if (!isPending) {
    setIsLoading(false);
  }
}, [isPending]);

return (
  <section>
    <PickCity onCityChange={handleCityChange} />
    {isLoading && <Loader />}
    {hasError && <ErrorBox>There was an error fetching weather data.</ErrorBox>}
    {!isLoading && !hasError && weatherData && (
      <WeatherSummary weatherData={weatherData} />
    )}
  </section>
);
};

export default WeatherBox;