import Link from "next/link";

export default function Page() {
  return (
    <>
      <div style={{ color: "white" }}>
        albums go to <Link href={"/music"}>Testo</Link>
      </div>


      <audio controls src={"http://localhost:8000/stream"} preload={"none"}/>
    </>
  );
}
