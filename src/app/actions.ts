"use server";

import { z } from "zod";
import { isAddress } from "viem";

import prisma from "@/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const initTxnSchema = z.object({
    // setting defaults for chain and token fields for now
    chainId: z.string().default("0x13881"),
    tokenName: z.string().default("USD Coin (PoS)"),
    tokenSymbol: z.string().default("USDC"),
    tokenContract: z.string().refine(address => isAddress(address), {
        message: "Provided contractAddress is invalid. Please ensure that the address is in the right format.",
    }).default("0x9999f7fea5938fd3b1e26a12c3f2fb024e194f97"),

    // setting empty fields to be filled later during the transaction
    fromAddress: z.string().default(""),
    toAddress: z.string().default(""),
    txnHash: z.string().default(""),
    status: z.enum(["CREATED", "PENDING", "SUCCESS", "FAILURE"]).default("CREATED"),

    // the required fields
    amount: z.number().gt(0, { message: "Need an amount greated than zero to initialize a tranasction" }),
    projectId: z.number().gt(0, { message: "Invalid projectId" })
})

export async function initTransaction(req: { amount: number, projectId: number }) {
    try {
        const validatedReq = initTxnSchema.safeParse(req);
        if (!validatedReq.success) {
            return { error: validatedReq.error, status: 400 };
        }
        const project = await prisma.project.findUnique({
            where: {
                id: validatedReq.data.projectId,
            },
        });
        if (project) {
            const result = await prisma.transaction.create({
                data: { ...validatedReq.data, toAddress: project.depositAddress },
            });
            return { result };
        } else {
            throw new Error(`Given project doesn't exist for ID: ${validatedReq.data.projectId}`)
        }
    } catch (error) {
        console.error(error);
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return { error: error.message, status: 400 };
            }
        } else {
            return { error: "Error creating transaction", status: 500 };
        }
    }
}