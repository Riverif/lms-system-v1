import Link from "next/link";
import { redirect } from "next/navigation";

import { currentUser } from "@/lib/auth";

import { Button } from "@/components/ui/button";
import { getCourses } from "@/data/course";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const CoursesPage = async () => {
  const user = await currentUser();

  if (!user?.id) {
    return redirect("/");
  }

  const courses = await getCourses(user.id);

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;
