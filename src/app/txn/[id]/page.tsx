import { getTransaction } from "./actions";

export default async function Page({ params }: { params: { id: string } }) {
  const transaction = await getTransaction(params.id);
  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-6">
      <p>Transaction ID: {transaction.id}</p>
      <p>Details: </p>
      <pre>{JSON.stringify(transaction, null, 4)}</pre>
    </main>
  );
}
