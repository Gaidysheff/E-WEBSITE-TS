import { Search } from "lucide-react";

const SearchForm = () => {
  return (
    <form action="/search" className="search-form">
      <input
        type="text"
        name="query"
        className="flex-1 font-bold w-full outline-none"
        placeholder="Search Products"
        required
      />

      <button
        type="submit"
        title="Search_From"
        className="size-[30px] rounded-full flex justify-center items-center
        bg-primaryDark text-primaryLight hover:bg-primaryDark/50
        group/btn transition duration-300 hover:scale-110 cursor-pointer"
      >
        <Search className="size-4" />
      </button>
    </form>
  );
};

export default SearchForm;
