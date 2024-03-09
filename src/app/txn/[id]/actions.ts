"use server";

import { Transaction } from "@prisma/client";

export async function getTransaction(id: string) {
    const transaction = await fetch(`http://localhost:3000/api/v1/transaction/${id}`);
    return transaction.json() as Promise<Transaction>
}