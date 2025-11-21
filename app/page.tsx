import { mockTokens } from "@/feature/token/mockData";
import TokenTablePage from "./token-table-page";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-2">
     
      <TokenTablePage />
    </main>
  );
}

