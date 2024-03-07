import { z } from "zod";
import prisma from "@/db";
import { isAddress } from "viem";

const patchReqBodySchema = z.object({
    name: z.string({ required_error: "Name is required." }).optional(),
    depositAddress: z.string().refine(address => isAddress(address), {
        message: "Provided depositAddress is invalid. Please ensure that the wallet address is in the right format.",
    }).optional(),
});

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const project = await prisma.project.findFirst({
            where: {
                id: Number(params.id)
            }
        });
        return Response.json({ project });
    } catch (error) {
        console.error("/project/[id] GET", error);
        return Response.json({ error: `Error fetching project for ID: ${params.id}` })
    }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const reqBodyJSON = await request.json();
        const validatedReq = patchReqBodySchema.safeParse(reqBodyJSON);
        if (!validatedReq.success) {
            return Response.json(validatedReq.error, { status: 400 });
        }
        const updatedData = validatedReq.data;
        const result = await prisma.project.update({
            where: {
                id: Number(params.id)
            },
            data: updatedData,
        });
        return Response.json({ result });
    } catch (error) {
        console.error("/project/[id] PUT", error);
        return Response.json({ error: `Error updating project for ID: ${params.id}` }, { status: 500 });
    }
}