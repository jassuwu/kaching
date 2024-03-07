import { z } from "zod";
import crypto from "crypto";
import { isAddress } from "viem";
import prisma from "@/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const postReqBodySchema = z.object({
    name: z.string({ required_error: "Name is required." }),
    depositAddress: z.string().refine(address => isAddress(address), {
        message: "Provided depositAddress is invalid. Please ensure that the wallet address is in the right format.",
    }),
    clientId: z.number(),
});

export async function GET() {
    try {
        const projects = await prisma.project.findMany();
        return Response.json({ projects });
    } catch (error) {
        return Response.json({ error: "Error fetching projects." }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const reqBodyJSON = await request.json();
        const validatedReq = postReqBodySchema.safeParse(reqBodyJSON);
        if (!validatedReq.success) {
            return Response.json(validatedReq.error, { status: 400 });
        }
        const secretKey = crypto.randomBytes(32).toString('hex');
        const result = await prisma.project.create({
            data: {
                ...validatedReq.data,
                secret: secretKey,
            },
        });
        return Response.json({ result });
    } catch (error) {
        console.error(error);
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return Response.json({ error: error.message }, { status: 400 });
            }
        } else {
            return Response.json({ error: "Error creating project" }, { status: 500 });
        }
    }
}