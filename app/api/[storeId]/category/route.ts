import prismaDb from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
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

    const category = await prismaDb.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
      },
    });

    return new Response(JSON.stringify(category), { status: 201 });
  } catch (error) {
    console.log("[CATEGORY_POST]", error);
    return new Response("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new Response("Store id is required", { status: 400 });
    }

    const categories = await prismaDb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    console.log("[CATEGORY_GET]", error);
    return new Response("Internal Error", { status: 500 });
  }
}
