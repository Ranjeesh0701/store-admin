import prismaDb from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs";

export async function GET(
  _req: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    if (!params.colorId) {
      return new Response("Color id is required", { status: 400 });
    }

    const color = await prismaDb.color.findUnique({
      where: {
        id: params.colorId,
      },
    });

    return new Response(JSON.stringify(color), { status: 200 });
  } catch (error) {
    console.log("COLOR_GET", error);
    return new Response("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
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

    if (!params.colorId) {
      return new Response("Color id is required", { status: 400 });
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

    const color = await prismaDb.color.updateMany({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    });

    return new Response(JSON.stringify(color), { status: 200 });
  } catch (error) {
    console.log("COLOR_PATCH", error);
    return new Response("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthenticated", { status: 401 });
    }

    if (!params.colorId) {
      return new Response("Color id is required", { status: 400 });
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

    const color = await prismaDb.color.deleteMany({
      where: {
        id: params.colorId,
      },
    });

    return new Response(JSON.stringify(color), { status: 200 });
  } catch (error) {
    console.log("COLOR_DELETE", error);
    return new Response("Internal Error", { status: 500 });
  }
}
