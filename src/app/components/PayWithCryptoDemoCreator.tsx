"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { initTransaction } from "../actions";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  amount: z.string().refine((amt) => Number(amt) > 0, {
    message: "Need an amount greater than 0 to initiate a transaction.",
  }),
});

export default function PayWithCryptoDemoCreator() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
    },
  });

  async function onSumbit(values: z.infer<typeof formSchema>) {
    try {
      const response = await initTransaction({
        amount: Number(values.amount),
        projectId: 1, // Assumed to be the dummy project Id for the purpose of the demo
      });
      if (!response?.error) {
        router.push(`/txn/${response?.result?.id}`);
      } else {
        throw new Error(String(response.error));
      }
    } catch (error) {
      console.error("Failed to init tx for demo.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSumbit)}
        className="flex flex-col justify-center items-center gap-2"
      >
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-center items-center gap-2">
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="text-center"
                  placeholder="0"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                What do you want your hypothetical order total to be ?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="rounded-full font-georama font-bold" type="submit">
          Pay with crypto
        </Button>
      </form>
    </Form>
  );
}
