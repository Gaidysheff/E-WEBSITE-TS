import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { FaHamburger } from "react-icons/fa";
import OptionsAuth from "./OptionsAuth";
import OptionsMain from "./OptionsMain";
import OptionsSupport from "./OptionsSupport";

// import NavItems from "./NavItems";




const MobileNavbar = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <FaHamburger className="text-3xl cursor-pointer" />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="flex flex-col items-center">
            <div className="text-center font-bold text-xl mb-3">E-Shop</div>
            <hr className="w-[75%] min-lg:hidden" />
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col items-center gap-10">
          {/* -------------- Core icons -------------- */}
          <OptionsMain />

          {/* ------------- Authorization ------------- */}
          <OptionsAuth />

          {/* ----------------- Other ----------------- */}
          <OptionsSupport />
        </div>

        {/* <NavItems mobile /> */}

        {/* <SheetClose className="overflow-y-auto">
          <NavItems mobile />
        </SheetClose> */}
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavbar;
