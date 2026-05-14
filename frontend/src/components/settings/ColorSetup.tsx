import { Button } from "@/components/ui/button.tsx";
import { useColor } from "@/store/ColorContext.tsx";

const ColorSetup = () => {
  // Забираем глобальный стейт из контекста
  const { hue, lightness, chroma, setHue, setLightness, setChroma } =
    useColor();

  const playTick = () => {
    const tick = new Audio("/public/tick.mp3");
    tick.volume = 0.1;
    tick.play().catch(() => {});
  };

  return (
    <section className="mb-20">
      {/* --------------------- Слайдеры цвета ------------------ */}
      <div className="flex flex-col items-center gap-4 py-10">
        <div className="w-70 relative z-[100]">
          <input
            type="range"
            className="w-full cursor-pointer accent-myMainColor mt-6"
            min="0"
            max="360"
            value={hue}
            onChange={(e) => {
              setHue(Number(e.target.value));
              playTick();
            }}
          />

          <p className="text-center font-medium">
            Hue: <span className="text-myMainColor">{hue}°</span>
          </p>

          <input
            type="range"
            className="w-full cursor-pointer accent-myMainColor mt-6"
            min="0"
            max="100"
            value={lightness}
            onChange={(e) => {
              setLightness(Number(e.target.value));
              playTick();
            }}
          />
          <p className="text-center font-medium">
            Lightness: <span className="text-myMainColor">{lightness}%</span>
          </p>
          <input
            type="range"
            className="w-full cursor-pointer accent-myMainColor mt-6"
            min="0"
            max="100"
            value={chroma}
            onChange={(e) => {
              setChroma(Number(e.target.value));
              playTick();
            }}
          />
          <p className="text-center font-medium">
            Chroma: <span className="text-myMainColor">{chroma}%</span>
          </p>

          <div className="flex justify-center">
            <Button
              onClick={() => {
                setHue(25);
                setLightness(62);
                setChroma(25);
              }}
              type="button"
              className="p-6 my-5 w-70"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ColorSetup;
