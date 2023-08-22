import prismaDb from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchive,
    } = body;

    if (!userId) {
      return new Response("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new Response("Name is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new Response("Images are required", { status: 400 });
    }

    if (!price) {
      return new Response("Price is required", { status: 400 });
    }

    if (!categoryId) {
      return new Response("Category Id is required", { status: 400 });
    }

    if (!sizeId) {
      return new Response("Size Id is required", { status: 400 });
    }

    if (!colorId) {
      return new Response("Color Id is required", { status: 400 });
    }

    if (!params.storeId) {
      return new Response("Store id is required", { status: 400 });
    }

    const storeByUserId = await prismaDb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new Response("Unauthorized", { status: 403 });
    }

    const product = await prismaDb.product.create({
      data: {
        name,
        price,
        isFeatured,
        isArchive,
        categoryId,
        colorId,
        sizeId,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return new Response(JSON.stringify(product), { status: 201 });
  } catch (error) {
    console.log("[PRODUCT_POST]", error);
    return new Response("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");
    const isArchive = searchParams.get("isArchive");

    if (!params.storeId) {
      return new Response("Store id is required", { status: 400 });
    }

    const products = await prismaDb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchive: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new Response("Internal Error", { status: 500 });
  }
}
