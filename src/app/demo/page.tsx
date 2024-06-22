import Link from "next/link";
import { PayWithCryptoDemoCreator } from "./components";
import { BrushIcon, Code2Icon } from "lucide-react";

export default function Home() {
  return (
    <main className="flex bg-black min-h-screen flex-col items-center justify-between p-24">
      <p className="text-primary text-9xl font-georama font-black">
        <span className="text-white">ka</span>ching
      </p>
      <section className="flex flex-col justify-center items-center">
        <p className="text-white text-lg">
          Create a <span className="text-primary font-black">fake</span>{" "}
          transaction to demo the product.
        </p>
        <PayWithCryptoDemoCreator />
      </section>
      <footer className="w-full flex justify-center items-center gap-6">
        <div className="flex justify-center items-center gap-2">
          <div className="text-white flex justify-center items-center gap-2">
            <BrushIcon className="h-4 w-4" />
            <p>by</p>
          </div>
          <Link
            className=" flex items-center gap-2 font-bold text-primary underline"
            href={"https://github.com/AKtwo47"}
          >
            AK
          </Link>
        </div>
        <p className="text-white font-bold">&&</p>
        <div className="flex justify-center items-center gap-2">
          <div className="text-white flex justify-center items-center gap-2">
            <Code2Icon className="h-4 w-4" />
            <p>by</p>
          </div>
          <Link
            className=" flex items-center gap-2 font-bold text-primary underline"
            href={"https://github.com/jassuwu"}
          >
            jass
          </Link>
        </div>
      </footer>
    </main>
  );
}
