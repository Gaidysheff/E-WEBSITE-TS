import DoubleWave from "./DoubleWave.tsx";
import type { JSX } from "react";
import WaveOne from "./WaveOne.tsx";
import WaveOneGradient from "./WaveOneGradient.tsx";

type Waves =
  | "mainPage_top"
  | "mainPage_top_gradient"
  | "mainPage_top_double"
  | "mainPage_bottom"
  | "mainPage_top_shifted";

interface Props {
  id: Waves;
}

const Waves = ({ id }: Props): JSX.Element | never => {
  if (id === "mainPage_top_gradient") {
    return <WaveOneGradient />;
  }

  if (id === "mainPage_top_double") {
    return <DoubleWave />;
  }

  if (id === "mainPage_top") {
    return (
      <div
        className="absolute top-0 left-0 w-full overflow-hidden
        line-height-0"
      >
        <WaveOne className="fill-myMainColor/5 mix-blend-screen" />
      </div>
    );
  }

  if (id === "mainPage_top_shifted") {
    return (
      <div
        className="absolute top-0 left-25 w-full overflow-hidden
        line-height-0"
      >
        <WaveOne className="fill-myMainColor/10 mix-blend-screen" />
      </div>
    );
  }

  if (id === "mainPage_bottom") {
    return (
      <div
        className="rotate-180 absolute top-0 left-0 w-full overflow-hidden
        line-height-0"
      >
        <WaveOne className="fill-myMainColor/10" />
      </div>
    );
  }

  const _: never = id;
  console.log("🚀 ~ WavesSwitch ~ _:", _);

  throw new Error();
};

export default Waves;
