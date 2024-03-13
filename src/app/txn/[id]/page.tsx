import { getTransaction } from "./actions";
import { TransactionDetails, ClientWrapper } from "./components";

export default async function Page({ params }: { params: { id: string } }) {
  const transaction = await getTransaction(params.id);
  if (transaction) {
    return (
      <main className="h-screen bg-black flex flex-col items-center">
        <ClientWrapper transaction={transaction}>
          <TransactionDetails id={params.id} />
        </ClientWrapper>
      </main>
    );
  } else {
    console.log("The returned transaction was undefined.");
  }
}
