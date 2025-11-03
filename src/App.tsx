import { WeatherProvider } from './context/WeatherContext';
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