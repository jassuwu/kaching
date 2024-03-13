"use server";

import prisma from "@/db";

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