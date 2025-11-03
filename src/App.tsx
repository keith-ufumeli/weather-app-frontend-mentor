import { WeatherProvider } from './context/WeatherContextProvider';
import { WeatherApp } from './components/WeatherApp';
import './App.css';

function App() {
  return (
    <WeatherProvider>
      <WeatherApp />
    </WeatherProvider>
  );
}

export default App;