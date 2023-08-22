import prismaDb from "@/lib/prismaDb";

const getStockCount = async (storeId: string) => {
  const stockCount = await prismaDb.product.count({
    where: {
      storeId,
      isArchive: false,
    },
  });

  return stockCount;
};

export default getStockCount;
