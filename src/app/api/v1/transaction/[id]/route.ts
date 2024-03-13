import { z } from "zod";
import prisma from "@/db";
import { isAddress } from "viem";

const patchReqBodySchema = z.object({
    chainId: z.string().optional(),
    tokenName: z.string().optional(),
    tokenContract: z.string().refine(address => isAddress(address), {
        message: "Provided contractAddress is invalid. Please ensure that the address is in the right format.",
    }).optional(),
    tokenSymbol: z.string().optional(),
    fromAddress: z.string().refine(address => isAddress(address), {
        message: "Provided fromAddress is invalid. Please ensure that the address is in the right format.",
    }).optional(),
    amount: z.number().gt(0, { message: "The amount for the transcation can't be zero or below." }).optional(),
    txnHash: z.string().optional(),
    status: z.enum(["CREATED", "PENDING", "SUCCESS", "FAILURE"]).optional(),
});

export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        const transaction = await prisma.transaction.findUnique({
            where: {
                id: Number(params.id)
            },
            include: {
                project: {
                    include: {
                        client: true
                    }
                },
            }
        });
        if (transaction) {
            return Response.json(transaction);
        } else {
            throw new Error(`The fetched transaction for the ID ${params.id} was null.`)
        }
    } catch (error) {
        console.error("/transaction/[id] GET", error);
        return Response.json({ error: `Error fetching transaction for ID: ${params.id}` })
    }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const reqBodyJSON = await request.json();
        const validatedReq = patchReqBodySchema.safeParse(reqBodyJSON);
        if (!validatedReq.success) {
            return Response.json(validatedReq.error, { status: 400 });
        }
        const result = await prisma.transaction.update({
            where: {
                id: Number(params.id)
            },
            data: validatedReq.data,
        });
        return Response.json({ result });
    } catch (error) {
        console.error("/transaction/[id] PATCH", error);
        return Response.json({ error: `Error updating transaction for ID: ${params.id}` }, { status: 500 });
    }
}