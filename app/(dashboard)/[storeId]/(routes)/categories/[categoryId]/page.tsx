import prismaDb from "@/lib/prismaDb";
import CategoryForm from "./components/CategoryForm";

const Page = async ({
  params,
}: {
  params: { categoryId: string; storeId: string };
}) => {
  const category = await prismaDb.category.findUnique({
    where: {
      id: params.categoryId,
    },
  });

  const billboards = await prismaDb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm billboards={billboards} initialData={category} />
      </div>
    </div>
  );
};

export default Page;
