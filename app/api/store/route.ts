import prismaDb from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
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

    const store = await prismaDb.store.create({
      data: {
        userId,
        name,
      },
    });

    return new Response(JSON.stringify(store), { status: 201 });
  } catch (error) {
    console.log("[STORE_POST]", error);
    return new Response("Internal Error", { status: 500 });
  }
}
