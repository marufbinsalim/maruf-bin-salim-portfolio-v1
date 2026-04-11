import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-3 p-10">
      <Link href="/">Home</Link>
      {
        Array.from({ length: 1000 }).map((_, i) => (
          <div className="h-20 w-full bg-black" key={i} />
        ))
      }
    </div>
  );
}
