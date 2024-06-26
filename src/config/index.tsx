import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { createPublicClient, http } from "viem";
import { cookieStorage, createStorage } from "wagmi";
import { sepolia } from "wagmi/chains";

export const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined.");

const metadata = {
  name: "kaching",
  description: "payment gateway to get paid in crypto",
  url: "http://localhost:3000",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [sepolia] as const;

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});
