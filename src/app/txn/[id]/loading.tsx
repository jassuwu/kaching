import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="h-screen bg-black flex flex-col items-center">
      <section className="h-[92%] w-full flex flex-col justify-between items-center">
        <div className="p-20 pb-14">
          <p className="text-white font-black text-7xl tracking-wide font-georama">
            ka<span className="text-primary">ching</span>
          </p>
        </div>
        <div className="bg-black h-full flex flex-col border-t border-x border-borderGray rounded-t-3xl z-20 w-[500px]">
          <div className="px-8 py-4">
            <p className="text-2xl text-white font-extrabold">Checkout for</p>

            <Skeleton className="h-6 w-1/2" />
          </div>
          <div className="border-b border-borderGray" />
          <div className="px-8 py-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <p className="text-stone-400">Transaction ID</p>
              <Skeleton className="h-6 w-1/2" />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-stone-400">Amount</p>
              <Skeleton className="h-6 w-1/2" />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-stone-400">Chain</p>
              <Skeleton className="h-6 w-1/2" />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-stone-400">Token</p>
              <Skeleton className="h-6 w-1/2" />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-stone-400">Amount (in tokens)</p>
              <Skeleton className="h-6 w-1/2" />
            </div>
          </div>
          <div className="w-full flex justify-center items-center">
            <Skeleton className="h-10 w-36" />
          </div>
        </div>
      </section>
      <footer className="h-[8%] bg-stone-950 w-full shadow-defaultBackdrop flex justify-center items-center">
        <div className="h-full w-[500px] flex justify-between items-center px-4 py-2">
          <div className="flex flex-col justify-center items-start">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-10 w-1/2" />
          </div>
          <div className="border border-white p-2 rounded-md">
            <p className="text-white tracking-widest">20:00</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
