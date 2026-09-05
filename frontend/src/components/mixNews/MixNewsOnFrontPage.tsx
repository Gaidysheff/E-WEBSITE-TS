import FilterLabels from "./FilterLabels";
import FilterResult from "./FilterResult";
import { AppLink as Link } from "@/components/appLink/AppLink";
import { useI18nContext } from "@/i18n/i18n-react";
import { useState } from "react";

const MixNewsOnFrontPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { LL } = useI18nContext();

  return (
    <section className="mb-30">
      <div className="container">
        {/* -------------------- Heading -------------------- */}
        <div>
          <p className="text-2xl">
            {LL.newsApplication.subtitle()}
            {/* our news and events */}
          </p>
          <h2 className="text-5xl">
            {LL.newsApplication.title()}
            {/* Useful Articles */}
          </h2>
        </div>

        <div className="flex max-sm:flex-col justify-between">
          <div className="my-6">
            <FilterLabels
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
          <Link
            to="/news/newsIndex"
            className="flex items-center hover:scale-110 duration-500
            cursor-pointer italic max-sm:mb-6"
          >
            {LL.newsApplication.seeAll()}
            {/* Смотреть все новости */}
          </Link>
        </div>
        <FilterResult selectedCategory={selectedCategory} />
      </div>
    </section>
  );
};

export default MixNewsOnFrontPage;
