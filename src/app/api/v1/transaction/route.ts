import { z } from "zod";
import { isAddress } from "viem";
import prisma from "@/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const postReqBodySchema = z.object({
    chainId: z.string(),
    tokenName: z.string(),
    tokenContract: z.string().refine(address => isAddress(address), {
        message: "Provided contractAddress is invalid. Please ensure that the address is in the right format.",
    }),
    tokenSymbol: z.string(),
    fromAddress: z.string().refine(address => isAddress(address), {
        message: "Provided fromAddress is invalid. Please ensure that the address is in the right format.",
    }),
    toAddress: z.string().refine(address => isAddress(address), {
        message: "Provided toAddress is invalid. Please ensure that the address is in the right format.",
    }),
    amount: z.number().gt(0, { message: "The amount for the transcation can't be zero or below." }),
    txnHash: z.string().default(""),
    status: z.enum(["CREATED", "PENDING", "SUCCESS", "FAILURE"]).default("CREATED"),
    projectId: z.number(),
});

export async function GET() {
    try {
        const transactions = await prisma.transaction.findMany();
        return Response.json({ transactions });
    } catch (error) {
        return Response.json({ error: "Error fetching transactions." }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const reqBodyJSON = await request.json();
        const validatedReq = postReqBodySchema.safeParse(reqBodyJSON);
        if (!validatedReq.success) {
            return Response.json(validatedReq.error, { status: 400 });
        }
        const result = await prisma.transaction.create({
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
            return Response.json({ error: "Error creating transaction" }, { status: 500 });
        }
    }
}