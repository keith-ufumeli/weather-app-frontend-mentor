import { SearchBar } from '@/components/SearchBar';
import { UnitsDropdown } from '@/components/UnitsDropdown';
import logoIcon from '@/assets/images/logo.svg';

export function Header() {
  return (
    <header className="bg-neutral-900">
      <div className="container mx-auto px-4 md:px-6 py-6 max-w-7xl">
        {/* Top row: Logo and Units */}
        <div className="flex items-center justify-between mb-6">
          <img 
            src={logoIcon} 
            alt="Weather App Logo" 
            className="h-8"
          />
          
          <UnitsDropdown />
        </div>

        {/* Main heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-0 text-center mb-8 md:mb-10 font-display">
          How's the sky looking today?
        </h1>

        {/* Search bar centered */}
        <div className="flex justify-center">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
