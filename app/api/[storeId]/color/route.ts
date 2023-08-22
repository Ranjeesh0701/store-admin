import prismaDb from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, value } = body;

    if (!userId) {
      return new Response("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new Response("Name is required", { status: 400 });
    }

    if (!value) {
      return new Response("Value is required", { status: 400 });
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

    const color = await prismaDb.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return new Response(JSON.stringify(color), { status: 201 });
  } catch (error) {
    console.log("[COLOR_POST]", error);
    return new Response("Internal Error", { status: 500 });
  }
}

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new Response("Store id is required", { status: 400 });
    }

    const colors = await prismaDb.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return new Response(JSON.stringify(colors), { status: 200 });
  } catch (error) {
    console.log("[COLOR_GET]", error);
    return new Response("Internal Error", { status: 500 });
  }
}
