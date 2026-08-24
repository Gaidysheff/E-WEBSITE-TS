import "./styles.css";

import { useEffect, useRef, useState } from "react";

import Image1 from "@/assets/images/news/1.jpg";
import Image2 from "@/assets/images/news/2.jpg";
import Image3 from "@/assets/images/news/3.jpg";
import Image4 from "@/assets/images/news/4.jpg";
import Image5 from "@/assets/images/news/5.jpg";
import { AppLink as Link } from "@/components/appLink/AppLink";
import { cn } from "@/lib/utils.ts";
import mixitup from "mixitup";

type Props = {};

// 1. Описываем список ваших кнопок-фильтров
const FILTER_BUTTONS = [
  { label: "All", filter: "all" },
  { label: "Marketing", filter: ".marketing" },
  { label: "HR & Recrutin", filter: ".hr" },
  { label: "Management", filter: ".management" },
  { label: "Design", filter: ".design" },
  { label: "Development", filter: ".development" },
];

const MixItUp = (props: Props) => {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const containerRef = useRef<HTMLDivElement>(null);
  const mixerRef = useRef<any>(null); // Храним ссылку на миксер,
  // чтобы уничтожить при размонтировании

  useEffect(() => {
    if (containerRef.current) {
      // Инициализируем MixItUp на основе ссылки useRef
      mixerRef.current = mixitup(containerRef.current, {
        selectors: {
          target: ".mix", // Класс карточек товаров
        },
        animation: {
          duration: 300,
        },
      });
    }

    // КРИТИЧЕСКИ ВАЖНО для React: уничтожаем миксер при уходе со страницы,
    // чтобы не было утечек памяти и дублирования анимаций
    return () => {
      if (mixerRef.current) {
        mixerRef.current.destroy();
      }
    };
  }, []);

  return (
    <section className="mb-30">
      <div className="container">
        <div>
          {/* -------------------- Heading -------------------- */}
          <div className="mb-10">
            {/* <div className="directions__heading heading heading--text-center"> */}
            <p className="text-2xl">our news and events</p>
            <h2 className="text-5xl">Useful Articles</h2>
            {/* </div> */}
          </div>

          <div>
            {/* -------------------- Buttons -------------------- */}
            <div
              className="controls
              flex flex-wrap items-center mb-8 gap-3 text-base"
            >
              {FILTER_BUTTONS.map((btn) => {
                // Вычисляем true/false для конкретной кнопки
                const isActive = activeFilter === btn.filter;

                return (
                  <button
                    key={btn.filter}
                    className={cn(
                      "border border-primary rounded-sm p-1 px-2 overflow-auto whitespace-nowrap hover:scale-110 cursor-pointer transition-all",
                      isActive
                        ? "bg-primary text-white"
                        : "bg-transparent text-primary",
                    )}
                    type="button"
                    data-filter={btn.filter}
                    // При клике обновляем стейт, React перерисует класс,
                    // а MixItUp запустит анимацию
                    onClick={() => setActiveFilter(btn.filter)}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>
            {/* -------------------- Content List -------------------- */}
            <div
              ref={containerRef}
              className="
              grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-5
              lg:gap-6 xl:gap-10"
            >
              <div
                className="mix marketing
                overflow-hidden border border-primary rounded-lg"
                data-order="1"
              >
                <Link className="duration-300 ease-in" to={"#"}>
                  <div className=" flex flex-col justify-between">
                    <div>
                      <img
                        className="h-full w-full"
                        src={Image1}
                        alt="image of Marketing"
                      />
                    </div>
                    <div className="flex flex-col justify-between p-4">
                      <div
                        className="mr-auto bg-sky-600 text-white font-semibold
												px-2 leading-8 rounded-sm mb-3"
                      >
                        Marketing
                      </div>
                      <p className="text-primary mb-6">
                        Odio posuere netus quisque faucibus lectus arcu donec.
                        Eget dictum eu viverra faucibus. Viverra scelerisque
                        consequat.
                      </p>
                      <div
                        className="text-myMainColor font-semibold ml-auto
												hover:scale-105 duration-500"
                      >
                        Read the article
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              <div
                className="mix management
                overflow-hidden border border-primary rounded-lg"
                data-order="2"
              >
                <Link className="duration-300 ease-in" to={"#"}>
                  <div className=" flex flex-col justify-between">
                    <div>
                      <img
                        className="h-full w-full"
                        src={Image2}
                        alt="image of Management"
                      />
                    </div>
                    <div className="flex flex-col justify-between p-4">
                      <div
                        className="mr-auto bg-amber-600 text-white font-semibold
												px-2 leading-8 rounded-sm mb-3"
                      >
                        Management
                      </div>
                      <p className="text-primary mb-6">
                        Odio posuere netus quisque faucibus lectus arcu donec.
                        Eget dictum eu viverra faucibus. Viverra scelerisque
                        consequat.
                      </p>
                      <div
                        className="text-myMainColor font-semibold ml-auto
												hover:scale-105 duration-500"
                      >
                        Read the article
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              <div
                className="mix hr
                overflow-hidden border border-primary rounded-lg"
                data-order="3"
              >
                <Link className="duration-300 ease-in" to={"#"}>
                  <div className=" flex flex-col justify-between">
                    <div>
                      <img
                        className="h-full w-full"
                        src={Image3}
                        alt="image of HR & Recruting"
                      />
                    </div>
                    <div className="flex flex-col justify-between p-4">
                      <div
                        className="mr-auto bg-lime-600 text-white font-semibold
												px-2 leading-8 rounded-sm mb-3"
                      >
                        HR & Recruting
                      </div>
                      <p className="text-primary mb-6">
                        Odio posuere netus quisque faucibus lectus arcu donec.
                        Eget dictum eu viverra faucibus. Viverra scelerisque
                        consequat.
                      </p>
                      <div
                        className="text-myMainColor font-semibold ml-auto
												hover:scale-105 duration-500"
                      >
                        Read the article
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              <div
                className="mix design
                overflow-hidden border border-primary rounded-lg"
                data-order="4"
              >
                <Link className="duration-300 ease-in" to={"#"}>
                  <div className=" flex flex-col justify-between">
                    <div>
                      <img
                        className="h-full w-full"
                        src={Image4}
                        alt="image of Design"
                      />
                    </div>
                    <div className="flex flex-col justify-between p-4">
                      <div
                        className="mr-auto bg-violet-600 text-white font-semibold
												px-2 leading-8 rounded-sm mb-3"
                      >
                        Design
                      </div>
                      <p className="text-primary mb-6">
                        Odio posuere netus quisque faucibus lectus arcu donec.
                        Eget dictum eu viverra faucibus. Viverra scelerisque
                        consequat.
                      </p>
                      <div
                        className="text-myMainColor font-semibold ml-auto
												hover:scale-105 duration-500"
                      >
                        Read the article
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              <div
                className="mix development
                overflow-hidden border border-primary rounded-lg"
                data-order="5"
              >
                <Link className="duration-300 ease-in" to={"#"}>
                  <div className=" flex flex-col justify-between">
                    <div>
                      <img
                        className="h-full w-full"
                        src={Image5}
                        alt="image of Development"
                      />
                    </div>
                    <div className="flex flex-col justify-between p-4">
                      <div
                        className="mr-auto bg-rose-600 text-white font-semibold
												px-2 leading-8 rounded-sm mb-3"
                      >
                        Development
                      </div>
                      <p className="text-primary mb-6">
                        Odio posuere netus quisque faucibus lectus arcu donec.
                        Eget dictum eu viverra faucibus. Viverra scelerisque
                        consequat.
                      </p>
                      <div
                        className="text-myMainColor font-semibold ml-auto
												hover:scale-105 duration-500"
                      >
                        Read the article
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* -------------------- Subscribe -------------------- */}
              <div
                className="mix marketing hr management design development
								flex flex-col justify-center gap-5 rounded-lg p-5
								border border-primary rounded-lg
								bg-primaryLighter/50 text-primaryDark text-lg font-semibold
								text-center"
                data-order="6"
              >
                <p className="text-xl">More news coming soon...</p>
                <p>Don't want to miss it?</p>
                <div>
                  <div
                    className="text-myMainColor font-semibold
										hover:scale-110 duration-500 text-2xl"
                  >
                    <Link to={"#"}>Just subscribe</Link>
                  </div>{" "}
                  <p>for receiving our freshest news in your email box.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MixItUp;
