import prismaDb from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs";

export async function GET(
  _req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return new Response("Category id is required", { status: 400 });
    }

    const category = await prismaDb.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: {
        billboard: true,
      },
    });

    return new Response(JSON.stringify(category), { status: 200 });
  } catch (error) {
    console.log("CATEGORY_GET", error);
    return new Response("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, billboardId } = body;

    if (!userId) {
      return new Response("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new Response("Name is required", { status: 400 });
    }

    if (!billboardId) {
      return new Response("Billboard id is required", { status: 400 });
    }

    if (!params.categoryId) {
      return new Response("Category id is required", { status: 400 });
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

    const category = await prismaDb.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return new Response(JSON.stringify(category), { status: 200 });
  } catch (error) {
    console.log("CATEGORY_PATCH", error);
    return new Response("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthenticated", { status: 401 });
    }

    if (!params.categoryId) {
      return new Response("Category id is required", { status: 400 });
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

    const category = await prismaDb.category.deleteMany({
      where: {
        id: params.categoryId,
      },
    });

    return new Response(JSON.stringify(category), { status: 200 });
  } catch (error) {
    console.log("CATEGORY_DELETE", error);
    return new Response("Internal Error", { status: 500 });
  }
}
