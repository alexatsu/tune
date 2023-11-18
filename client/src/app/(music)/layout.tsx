import { Player } from "./_root/layouts";


export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Player />
    </>
  );
}
