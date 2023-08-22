import prismaDb from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs";

export async function GET(
  _req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new Response("Billboard id is required", { status: 400 });
    }

    const billboard = await prismaDb.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });

    return new Response(JSON.stringify(billboard), { status: 200 });
  } catch (error) {
    console.log("BILLBOARD_GET", error);
    return new Response("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { label, imageUrl } = body;

    if (!userId) {
      return new Response("Unauthenticated", { status: 401 });
    }

    if (!label) {
      return new Response("Label is required", { status: 400 });
    }

    if (!imageUrl) {
      return new Response("Image URL is required", { status: 400 });
    }

    if (!params.billboardId) {
      return new Response("Billboard id is required", { status: 400 });
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

    const billboard = await prismaDb.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    return new Response(JSON.stringify(billboard), { status: 200 });
  } catch (error) {
    console.log("BILLBOARD_PATCH", error);
    return new Response("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthenticated", { status: 401 });
    }

    if (!params.billboardId) {
      return new Response("Billboard id is required", { status: 400 });
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

    const billboard = await prismaDb.billboard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });

    return new Response(JSON.stringify(billboard), { status: 200 });
  } catch (error) {
    console.log("BILLBOARD_DELETE", error);
    return new Response("Internal Error", { status: 500 });
  }
}
