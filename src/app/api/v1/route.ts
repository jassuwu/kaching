import prisma from "@/db";

export async function GET() {
    return Response.json({ error: false, message: "You're looking at kaching's backend.", isPrismaReady: Boolean(prisma) });
}