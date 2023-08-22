import prismaDb from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name } = body;
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    if (!name) {
      return new Response("Name is required", { status: 400 });
    }

    if (!params.storeId) {
      return new Response("Store id is required", { status: 400 });
    }

    const store = await prismaDb.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
      },
    });

    return new Response(JSON.stringify(store), { status: 200 });
  } catch (error) {
    console.log("STORE_PATCH", error);
    return new Response("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new Response("Store id is required", { status: 400 });
    }

    const store = await prismaDb.store.deleteMany({
      where: {
        id: params.storeId,
        userId,
      },
    });

    return new Response(JSON.stringify(store), { status: 200 });
  } catch (error) {
    console.log("STORE_DELETE", error);
    return new Response("Internal Error", { status: 500 });
  }
}
