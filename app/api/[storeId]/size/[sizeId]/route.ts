import prismaDb from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs";

export async function GET(
  _req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    if (!params.sizeId) {
      return new Response("Size id is required", { status: 400 });
    }

    const size = await prismaDb.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });

    return new Response(JSON.stringify(size), { status: 200 });
  } catch (error) {
    console.log("SIZE_GET", error);
    return new Response("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
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

    if (!params.sizeId) {
      return new Response("Size id is required", { status: 400 });
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

    const size = await prismaDb.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    });

    return new Response(JSON.stringify(size), { status: 200 });
  } catch (error) {
    console.log("SIZE_PATCH", error);
    return new Response("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthenticated", { status: 401 });
    }

    if (!params.sizeId) {
      return new Response("Size id is required", { status: 400 });
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

    const size = await prismaDb.size.deleteMany({
      where: {
        id: params.sizeId,
      },
    });

    return new Response(JSON.stringify(size), { status: 200 });
  } catch (error) {
    console.log("SIZE_DELETE", error);
    return new Response("Internal Error", { status: 500 });
  }
}
