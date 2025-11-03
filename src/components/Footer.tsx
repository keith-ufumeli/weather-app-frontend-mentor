export function Footer() {
  return (
    <footer className="border-t border-neutral-800 py-6 mt-auto">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <p className="text-center text-sm text-neutral-400">
          Challenge by{' '}
          <a
            href="https://www.frontendmentor.io/challenges/weather-app-K1FhddVm49"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-200 hover:text-white underline-offset-4 hover:underline transition-colors"
          >
            Frontend Mentor
          </a>
          . Coded by{' '}
          <a
            href="https://github.com/keith-ufumeli"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-200 hover:text-white underline-offset-4 hover:underline transition-colors"
          >
            Keith Ufumeli
          </a>
          .
        </p>
      </div>
    </footer>
  );
}

