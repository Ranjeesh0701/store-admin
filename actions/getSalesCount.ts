import prismaDb from "@/lib/prismaDb";

const getSalesCount = async (storeId: string) => {
  const salesCount = await prismaDb.order.count({
    where: {
      storeId,
      isPaid: true,
    },
  });

  return salesCount;
};

export default getSalesCount;
