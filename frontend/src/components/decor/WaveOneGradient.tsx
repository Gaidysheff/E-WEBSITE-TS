const WaveOneGradient = () => {
  return (
    <div className="absolute top-0 left-0 w-full overflow-hidden line-height-0">
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="relative block w-full h-[50px] sm:h-[200px]"
        fill="url(#wave-gradient)"
      >
        {/* Описываем градиент внутри SVG */}
        <defs>
          <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            {/* Вместо классов from/to используем нативные stop-color. 
											В инлайновые стили Tailwind-переменные подставляются отлично! */}
            <stop
              offset="0%"
              style={{
                stopColor: "var(--color-myMainColor, #fa012a)",
                stopOpacity: 0.15,
              }}
            />
            <stop
              offset="100%"
              style={{
                stopColor: "var(--color-myMainColor, #fa012a)",
                stopOpacity: 0.01,
              }}
            />
          </linearGradient>
        </defs>

        <path d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,186.7C960,192,1056,160,1152,144C1248,128,1344,128,1392,128L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
      </svg>
    </div>
  );
};

export default WaveOneGradient;
