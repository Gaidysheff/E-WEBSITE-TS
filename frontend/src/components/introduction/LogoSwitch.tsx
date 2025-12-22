import DarkLogo from "@/assets/images/shared/Kalika-LogoSignNew.png";
import LightLogo from "@/assets/images/shared/Kalika-LogoSign-Gray.png";
import { type ThemeSwitch } from "@/lib/types.ts";
import type { JSX } from "react";

type Props = {
  id: ThemeSwitch;
};

const LogoSwitch = ({ id }: Props): JSX.Element | never => {
  if (id === "light") {
    return (
      <div className="max-w-[700px] mx-auto">
        <img src={LightLogo} alt="Light Logo" className="w-[90%]auto" />
      </div>
    );
  }
  if (id === "dark") {
    return (
      <div className="max-w-[700px] mx-auto">
        <img src={DarkLogo} alt="Dark Logo" className="w-[90%]auto" />
      </div>
    );
  }

  const _: never = id;
  console.log(_);

  throw new Error();
};

// const LogoSwitch = ({ id }: Props) => {
//   switch (id) {
//     case "light":
//       return (
//         <div className="max-w-[700px] mx-auto">
//           <img src={LightLogo} alt="Light Logo" className="w-[90%]auto" />
//         </div>
//       );
//     case "dark":
//       return (
//         <div className="max-w-[700px] mx-auto">
//           <img src={DarkLogo} alt="Dark Logo" className="w-[90%]auto" />
//         </div>
//       );

//     default:
//       return null;
//   }
// };

export default LogoSwitch;
