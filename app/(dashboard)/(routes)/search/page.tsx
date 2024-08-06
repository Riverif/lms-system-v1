import { Categories } from "./_components/categories";

import { getCategories } from "@/data/category";
import { SearchInput } from "@/components/search-input";

const SearchPage = async () => {
  const categories = await getCategories();

  return (
    <>
      <div className="px-6 pt-6 md:mb-0 md:hidden">
        <SearchInput />
      </div>
      <div className="p-6">
        <Categories items={categories} />
      </div>
    </>
  );
};

export default SearchPage;
