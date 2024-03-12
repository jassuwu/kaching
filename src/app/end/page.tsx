import Link from "next/link";

export default function Page() {
  return (
    <main className="flex bg-black min-h-screen flex-col items-center justify-between p-24">
      <p className="text-primary text-9xl font-georama font-black">
        End of demo.
      </p>
      <Link className="font-bold text-primary underline" href={"/"}>
        Click here to go back home
      </Link>
    </main>
  );
}
