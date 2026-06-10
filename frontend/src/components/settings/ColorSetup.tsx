import { Button } from "@/components/ui/button.tsx";
import { Switch } from "@/components/ui/switch";
import { useColor } from "@/store/ColorContext.tsx";
import { useI18nContext } from "@/i18n/i18n-react";

const ColorSetup = () => {
  const { LL } = useI18nContext();

  // Забираем глобальный стейт из контекста
  const {
    hue,
    lightness,
    chroma,
    isContrast,
    setHue,
    setLightness,
    setChroma,
    setIsContrast,
  } = useColor();

  // Вычисляем тон для превью-квадрата
  const secondaryHue = hue < 180 ? hue + 180 : hue - 180;
  const secondaryColorPreview = `oklch(${lightness}% ${chroma / 100} ${secondaryHue})`;

  const playTick = () => {
    const tick = new Audio("/tick.mp3");
    // const tick = new Audio("/public/tick.mp3");
    tick.volume = 0.1;
    tick.play().catch(() => {});
  };

  return (
    <section className="mb-20 space-y-6">
      <div className="flex flex-col items-center gap-4 py-10">
        {/* ---------------- Переключатель режимов --------------- */}
        <div
          className="flex flex-col items-center justify-between border-b
          pb-4 gap-5"
        >
          <span className="text-sm font-medium">
            {LL.colorSettings.mode()}
            {/* Color Scheme Mode */}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {isContrast
                ? `${LL.colorSettings.contrast()}`
                : `${LL.colorSettings.single()}`}
              {/* {isContrast ? "Contrast" : "Single"} */}
            </span>
            <Switch checked={isContrast} onCheckedChange={setIsContrast} />
          </div>
        </div>

        {/* --------------------- Слайдеры цвета ------------------ */}
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
            {LL.colorSettings.hue()} {/* Hue:  */}
            <span className="text-myMainColor">{hue}°</span>
          </p>

          {/* Маленький бокс-дисплей для отображения Secondary Color */}
          {isContrast && (
            <div className="flex items-center gap-2 animate-in fade-in duration-300">
              <span className="text-xs text-gray-400">
                {LL.colorSettings.secondary()} {/* Secondary: */}
              </span>
              <div
                className="w-6 h-6 rounded-md border shadow-inner transition-all duration-300"
                style={{ backgroundColor: secondaryColorPreview }}
                title={`Complementary Hue: ${secondaryHue}°`}
              />
            </div>
          )}

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
            {LL.colorSettings.lightness()} {/* Lightness:  */}
            <span className="text-myMainColor">{lightness}%</span>
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
            {LL.colorSettings.chroma()} {/* Chroma:  */}
            <span className="text-myMainColor">{chroma}%</span>
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
              {LL.general.reset()}
              {/* Reset */}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ColorSetup;
