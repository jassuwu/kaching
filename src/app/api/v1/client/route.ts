import { z } from "zod";
import { isAddress } from "viem";
import prisma from "@/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const postReqBodySchema = z.object({
    walletAddress: z.string().refine(address => isAddress(address), {
        message: "Provided address is invalid. Please ensure that the wallet address is in the right format.",
    }),
})

export async function GET() {
    try {
        const clients = await prisma.client.findMany();
        return Response.json({ clients });
    } catch (error) {
        return Response.json({ error: "Error fetching clients" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const reqBodyJSON = await request.json();
        const validatedReq = postReqBodySchema.safeParse(reqBodyJSON);
        if (!validatedReq.success) {
            return Response.json(validatedReq.error, { status: 400 });
        }
        const result = await prisma.client.create({
            data: validatedReq.data,
        });
        return Response.json({ result });
    } catch (error) {
        console.error(error);
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return Response.json({ error: error.message }, { status: 400 });
            }
        } else {
            return Response.json({ error: "Error creating client" }, { status: 500 });
        }
    }
}