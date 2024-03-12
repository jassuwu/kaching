import Link from "next/link";

export default function Home() {
  return (
    <main className="flex bg-black min-h-screen flex-col items-center justify-between p-24">
      <p className="text-primary text-9xl font-georama font-black">kaching.</p>
      <Link className="font-bold text-primary underline" href={"/txn/2"}>
        Click here to go an example txn with id 2
      </Link>
    </main>
  );
}
