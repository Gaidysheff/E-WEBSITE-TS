import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";
import ColorSetup from "./ColorSetup.tsx";
import { Settings } from "lucide-react";
import { useI18nContext } from "@/i18n/i18n-react";

const SettingsDrawer = () => {
  const { LL } = useI18nContext();

  // const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div className="flex flex-wrap gap-2">
      <Drawer direction="top">
        <DrawerTrigger asChild>
          {/* <Button variant="outline" className="capitalize">
            Settings
          </Button> */}
          <Settings
            size={40}
            className="text-primaryDark hover:text-primaryDark/50
              hover:scale-110 transition duration-300"
          />
        </DrawerTrigger>

        <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh]">
          <DrawerHeader>
            <DrawerTitle>
              {LL.colorSettings.settings()}
              {/* Settings */}
            </DrawerTitle>
            <DrawerDescription>
              {LL.colorSettings.setColor()}
              {/* Set your preferable color. */}
            </DrawerDescription>
          </DrawerHeader>

          <div className="no-scrollbar overflow-y-auto px-4">
            <ColorSetup />
          </div>

          <DrawerFooter>
            {/* <Button>Submit</Button> */}
            <DrawerClose asChild>
              <Button variant="outline">
                {LL.general.cancel()}
                {/* Cancel */}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SettingsDrawer;
