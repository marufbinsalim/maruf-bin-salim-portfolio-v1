import Navbar from "@/components/shared/navbar";
import Divider from "@/components/ui/divider";

export default function Home() {
  return (
    <div className="flex flex-col gap-3">
      <main>

        <section className="h-[1000px] bg-white">

        </section>

        <section className="h-[300px] relative flex items-center justify-center">
          Top Section
          <Divider color="black"/>
        </section>

        {/* 👇 Use it here */}
        <section className="h-[300px] flex items-center justify-center">
          Bottom Section
        </section>
      </main>
    </div>
  );
}
