import { z } from "zod";
import prisma from "@/db";
import { isAddress } from "viem";

const patchReqBodySchema = z.object({
    walletAddress: z.string().refine(address => isAddress(address), {
        message: "Provided address is invalid. Please ensure that the wallet address is in the right format.",
    }),
});

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const client = await prisma.client.findFirst({
            where: {
                id: Number(params.id)
            }
        });
        return Response.json({ client });
    } catch (error) {
        console.error("/client/[id] GET", error);
        return Response.json({ error: `Error fetching client for ID: ${params.id}` })
    }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const reqBodyJSON = await request.json();
        const validatedReq = patchReqBodySchema.safeParse(reqBodyJSON);
        if (!validatedReq.success) {
            return Response.json(validatedReq.error, { status: 400 });
        }
        const updatedBody = validatedReq.data;
        const result = await prisma.client.update({
            where: {
                id: Number(params.id)
            },
            data: updatedBody,
        });
        return Response.json({ result });
    } catch (error) {
        console.error("/client/[id] PATCH", error);
        return Response.json({ error: `Error updating client for ID: ${params.id}` }, { status: 500 });
    }
}

// DELETE should probably not be a thing, since this can bring gaps in DB.

// export async function DELETE(request: Request, { params }: { params: { id: string } }) {
//     try {
//         const result = await prisma.client.delete({
//             where: {
//                 id: Number(params.id),
//             },
//         });
//         return Response.json({ result });
//     } catch (error) {
//         console.error("/client/[id] DELETE", error);
//         return Response.json({ error: `Error deleting client for ID: ${params.id}` }, { status: 500 });
//     }
// }
