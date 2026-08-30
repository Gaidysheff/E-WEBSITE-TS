import FilterLabels from "./FilterLabels";
import FilterResult from "./FilterResult";
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

        <FilterLabels
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <FilterResult selectedCategory={selectedCategory} />
      </div>
    </section>
  );
};

export default MixNewsOnFrontPage;
