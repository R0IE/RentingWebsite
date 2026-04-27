import Image from "next/image";

import { Header } from "@/components/header";
import { MultiPosts } from "@/components/multiposts";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        
        <MultiPosts />
      </main>
    </div>
  );
}
