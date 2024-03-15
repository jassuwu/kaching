"use server";

import prisma from "@/db";
import { isAddress } from "viem";
import { z } from "zod";


const completeTransactionSchema = z.object({
    fromAddress: z.string().refine(address => isAddress(address), {
        message: "Provided fromAddress is invalid. Please ensure that the address is in the right format.",
    }),
    status: z.enum(["CREATED", "PENDING", "SUCCESS", "FAILURE"]),
    txnHash: z.string().default(""),
})


export async function getTransaction(id: string) {
    try {
        const transaction = await prisma.transaction.findUnique({
            where: {
                id: Number(id)
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
            return transaction;
        } else {
            throw new Error(`The fetched transaction for the ID ${id} was null.`)
        }
    } catch (error) {
        console.error("/transaction/[id] GET", error);
    }
}

export async function completeTransaction(id: number, info: { fromAddress: string, status: string, txnHash: string }) {

    const validatedInfo = completeTransactionSchema.safeParse(info);

    if (!validatedInfo.success) {
        return { error: validatedInfo.error }
    }

    try {
        const result = await prisma.transaction.update({
            where: {
                id,
            },
            data: validatedInfo.data,
        });
        return { result };
    } catch (error) {
        console.log("/transaction/[id] PATCH")
    }
}