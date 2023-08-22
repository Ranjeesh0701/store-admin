import prismaDb from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
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

    const billboard = await prismaDb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return new Response(JSON.stringify(billboard), { status: 201 });
  } catch (error) {
    console.log("[BILLBOARD_POST]", error);
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

    const billboards = await prismaDb.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return new Response(JSON.stringify(billboards), { status: 200 });
  } catch (error) {
    console.log("[BILLBOARD_GET]", error);
    return new Response("Internal Error", { status: 500 });
  }
}
