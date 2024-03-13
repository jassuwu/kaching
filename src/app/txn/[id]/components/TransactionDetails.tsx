import { getTransaction } from "../actions";

export default async function TransactionDetails({ id }: { id: string }) {
  const transaction = await getTransaction(id);
  if (transaction) {
    return (
      <>
        <div className="px-8 py-4">
          <p className="text-2xl text-white font-extrabold">Checkout for</p>
          <p className="text-lg text-white">{transaction.project.name}</p>
        </div>
        <div className="border-b border-borderGray" />
        <div className="px-8 py-6 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <p className="text-stone-400">Transaction ID</p>
            <p className="text-lg text-white">{transaction.id}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-stone-400">Amount</p>
            <p className="text-lg text-white">{transaction.amount} USD</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-stone-400">Chain</p>
            <p className="text-lg text-white">{transaction.chainId}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-stone-400">Token</p>
            <p className="text-lg text-white">{transaction.tokenName}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-stone-400">Amount (in tokens)</p>
            <p className="text-lg text-primary">{transaction.amount} USDC</p>
          </div>
        </div>
      </>
    );
  }
}
