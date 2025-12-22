import { EmblaCarousel } from "./HeroCarouselEmbla.jsx";

// const Hero = ({ productsForCarousel }) => {
const Hero = () => {
  return (
    <section
      className="bg-card text-center w-full px-2 py-5 sm:px-4 sm:py-10 
      lg:px-6 lg:py-16 "
    >
      <div
        className="max-w-4xl mx-auto space-y-8 px-6 sm:px-12 md:px-16 
				lg:px-24"
      >
        <h1
          className="text-xl 2xsm:text-2xl xsm:text-3xl sm:text-4xl lg:text-5xl 
          font-extrabold text-primaryDark leading-snug mb-1 2xsm:mb-2 xsm:mb-3 
          sm:mb-4 lg:mb-5 xl:mb-6"
        >
          Find the Perfect Product for Every Occasion
        </h1>
        <p
          className="text-sm xsm:text-base lg:text-lg text-primaryDark max-w-2xl 
          mx-auto mb-4 lg:mb-6 xl:mb-8"
        >
          Discover a curated selection of high-quality products designed to fit
          your lifestyle.
        </p>
        <a
          href="#product_section"
          className="inline-block bg-black text-white font-semibold 
					rounded-xl shadow-lg hover:bg-gray-900 transition-all duration-300 
          text-xs xsm:text-base md:text-lg 
          px-4 py-2 xsm:px-6 xsm:py-3 md:px-8"
        >
          Shop Now
        </a>
      </div>
      <div
        className="mt-[1rem] 2xsm:mt-[2rem] xsm:mt-[3rem] sm:mt-[4rem] 
        xl:mt-[5rem]"
      >
        <EmblaCarousel />
        {/* <EmblaCarousel productsForCarousel={productsForCarousel} /> */}
      </div>
    </section>
  );
};

export default Hero;
