import "./map.css";

import { Map, Placemark, YMaps } from "@pbe/react-yandex-maps";
import { useEffect, useState } from "react";

import office from "@/assets/contacts/officeOZON.png";

const YandexMap = () => {
  const [mapIconColor, setMapIconColor] = useState("#000000");

  useEffect(() => {
    // Вытаскиваем реальный HEX из вычисленных стилей документа
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-myMainColor")
      .trim();

    // Если браузер вернул oklch, нам нужно сконвертировать его или
    // просто использовать заранее подготовленную переменную с HEX.
    setMapIconColor(color);
  }, []);

  return (
    <>
      <section className="container" data-aos="flip-up" id="contacts">
        <div className="border-4 border-myMainColor/50 w-[80%] mx-auto relative z-10">
          <YMaps>
            <Map
              state={{
                center: [56.803505, 60.591195],
                zoom: 16,
                controls: ["zoomControl", "fullscreenControl"],
              }}
              width="100%"
              height="300px"
              modules={[
                "control.ZoomControl",
                "control.FullscreenControl",
                "geoObject.addon.balloon",
                "geoObject.addon.hint",
              ]}
            >
              <Placemark
                modules={["geoObject.addon.balloon"]}
                defaultGeometry={[56.803445340602664, 60.59119948099013]}
                options={{
                  // preset: "islands#redDotIcon",

                  iconColor: mapIconColor,
                }}
                properties={{
                  hintContent: "Наш магазин",
                  balloonContent: `
                  <div class="p-2 text-white">
                    <strong class="block mb-1">Екатеринбург</strong>
                    <p class="text-xs">ул. Печатников д.1, вход с торца</p>
                  </div>
                `,
                }}
                // onClick={() => {
                //   // ставим в очередь промисов, чтобы сработало после отрисовки балуна
                //   setTimeout(() => {
                //     setActivePortal(true);
                //   }, 0);
                // }}
              />
            </Map>
          </YMaps>
        </div>
      </section>
      <section className="bg-gray-300 mt-[-100px] md:mt-[-170px]">
        <div className="w-full grayscale">
          <img
            src={office}
            alt=""
            className="w-full lg:max-h-[500px] 2xl:max-h-[600px]"
          />
        </div>
      </section>
    </>
  );
};

export default YandexMap;
