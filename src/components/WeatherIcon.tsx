import { getWeatherIconName } from '@/utils/weatherUtils';
import sunnyIcon from '@/assets/images/icon-sunny.webp';
import partlyCloudyIcon from '@/assets/images/icon-partly-cloudy.webp';
import overcastIcon from '@/assets/images/icon-overcast.webp';
import rainIcon from '@/assets/images/icon-rain.webp';
import drizzleIcon from '@/assets/images/icon-drizzle.webp';
import stormIcon from '@/assets/images/icon-storm.webp';
import snowIcon from '@/assets/images/icon-snow.webp';
import fogIcon from '@/assets/images/icon-fog.webp';

interface WeatherIconProps {
  weatherCode: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

const iconMap: Record<string, string> = {
  sunny: sunnyIcon,
  'partly-cloudy': partlyCloudyIcon,
  overcast: overcastIcon,
  rain: rainIcon,
  drizzle: drizzleIcon,
  storm: stormIcon,
  snow: snowIcon,
  fog: fogIcon,
};

export function WeatherIcon({ weatherCode, className = '', size = 'md' }: WeatherIconProps) {
  const iconName = getWeatherIconName(weatherCode);
  const sizeClass = sizeMap[size];
  const iconSrc = iconMap[iconName] || partlyCloudyIcon;
  
  return (
    <img
      src={iconSrc}
      alt={`${iconName} weather icon`}
      className={`${sizeClass} ${className}`}
      aria-hidden="true"
    />
  );
}
