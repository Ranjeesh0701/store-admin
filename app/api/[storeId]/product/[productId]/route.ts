import prismaDb from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs";

export async function GET(
  _req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new Response("Product id is required", { status: 400 });
    }

    const product = await prismaDb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
    });

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    console.log("PRODUCT_GET", error);
    return new Response("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
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

    if (!params.productId) {
      return new Response("Product id is required", { status: 400 });
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

    await prismaDb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchive,
      },
    });

    const product = await prismaDb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    console.log("PRODUCT_PATCH", error);
    return new Response("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthenticated", { status: 401 });
    }

    if (!params.productId) {
      return new Response("Product id is required", { status: 400 });
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

    const product = await prismaDb.product.deleteMany({
      where: {
        id: params.productId,
      },
    });

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    console.log("PRODUCT_DELETE", error);
    return new Response("Internal Error", { status: 500 });
  }
}
