import { Categories } from "./_components/categories";

import { getCategories } from "@/data/category";
import { SearchInput } from "@/components/search-input";
import { getCourses } from "@/data/get-courses";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CoursesList } from "@/components/courses-list";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const user = await currentUser();

  if (!user?.id) {
    return redirect("/");
  }

  const categories = await getCategories();

  const courses = await getCourses({
    userId: user.id,
    ...searchParams,
  });

  return (
    <>
      <div className="px-6 pt-6 md:mb-0 md:hidden">
        <SearchInput />
      </div>
      <div className="space-y-4 p-6">
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  );
};

export default SearchPage;
