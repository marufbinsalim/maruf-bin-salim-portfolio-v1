import Navbar from "@/components/shared/navbar";
import Divider from "@/components/ui/divider";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-3">
      <Navbar />
      <main>
        <section className="h-[300px] relative bg-gray-500 flex items-center justify-center">
          Top Section
          <Divider color="black"/>
        </section>

        {/* 👇 Use it here */}
        <section className="h-[300px] bg-gray-600 flex items-center justify-center">
          Bottom Section
        </section>
      </main>
    </div>
  );
}
