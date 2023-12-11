import styles from "./styles.module.scss";
import cover1 from "../../../../../../public/music/NF - The Search/cover.jpg";
import cover2 from "../../../../../../public/music/ONICKS - ＂Illuminati＂ (Official Lyric Video)/cover.webp";
import cover3 from "../../../../../../public/music/Unholy (Sam Smith) 【covered by Anna ft. @chloebreez】｜ dual POV ver/cover.jpg";
import Image from "next/image";

const sources = [
  {
    src: "/music/NF - The Search/index.m3u8",
    title: "NF - The Search",
    duration: "4:51",
    cover: cover1,
  },
  {
    src: "/music/ONICKS - ＂Illuminati＂ (Official Lyric Video)/index.m3u8",
    title: "ONICKS -＂Illuminati＂ (Official Lyric Video)",
    duration: "3:14",
    cover: cover2,
  },
  {
    src: "/music/Unholy (Sam Smith) 【covered by Anna ft. @chloebreez】｜ dual POV ver/index.m3u8",
    title: "Unholy (Sam Smith) 【covered by Anna ft. @chloebreez】｜ dual POV ver",
    duration: "2:20",
    cover: cover3,
  },
  {
    src: "/music/NF - The Search/index.m3u8",
    title: "NF - The Search",
    duration: "4:51",
    cover: cover1,
  },
  {
    src: "/music/ONICKS - ＂Illuminati＂ (Official Lyric Video)/index.m3u8",
    title: "ONICKS -＂Illuminati＂ (Official Lyric Video)",
    duration: "3:14",
    cover: cover2,
  },
  {
    src: "/music/Unholy (Sam Smith) 【covered by Anna ft. @chloebreez】｜ dual POV ver/index.m3u8",
    title: "Unholy (Sam Smith) 【covered by Anna ft. @chloebreez】｜ dual POV ver",
    duration: "2:20",
    cover: cover3,
  },
  {
    src: "/music/NF - The Search/index.m3u8",
    title: "NF - The Search",
    duration: "4:51",
    cover: cover1,
  },
  {
    src: "/music/ONICKS - ＂Illuminati＂ (Official Lyric Video)/index.m3u8",
    title: "ONICKS -＂Illuminati＂ (Official Lyric Video)",
    duration: "3:14",
    cover: cover2,
  },
  {
    src: "/music/Unholy (Sam Smith) 【covered by Anna ft. @chloebreez】｜ dual POV ver/index.m3u8",
    title: "Unholy (Sam Smith) 【covered by Anna ft. @chloebreez】｜ dual POV ver",
    duration: "2:20",
    cover: cover3,
  },
  {
    src: "/music/NF - The Search/index.m3u8",
    title: "NF - The Search",
    duration: "4:51",
    cover: cover1,
  },
  {
    src: "/music/ONICKS - ＂Illuminati＂ (Official Lyric Video)/index.m3u8",
    title: "ONICKS -＂Illuminati＂ (Official Lyric Video)",
    duration: "3:14",
    cover: cover2,
  },
  {
    src: "/music/Unholy (Sam Smith) 【covered by Anna ft. @chloebreez】｜ dual POV ver/index.m3u8",
    title: "Unholy (Sam Smith) 【covered by Anna ft. @chloebreez】｜ dual POV ver",
    duration: "2:20",
    cover: cover3,
  },
  {
    src: "/music/NF - The Search/index.m3u8",
    title: "NF - The Search",
    duration: "4:51",
    cover: cover1,
  },
  {
    src: "/music/ONICKS - ＂Illuminati＂ (Official Lyric Video)/index.m3u8",
    title: "ONICKS -＂Illuminati＂ (Official Lyric Video)",
    duration: "3:14",
    cover: cover2,
  },
  {
    src: "/music/Unholy (Sam Smith) 【covered by Anna ft. @chloebreez】｜ dual POV ver/index.m3u8",
    title: "Unholy (Sam Smith) 【covered by Anna ft. @chloebreez】｜ dual POV ver",
    duration: "2:20",
    cover: cover3,
  },
  {
    src: "/music/NF - The Search/index.m3u8",
    title: "NF - The Search",
    duration: "4:51",
    cover: cover1,
  },
  {
    src: "/music/ONICKS - ＂Illuminati＂ (Official Lyric Video)/index.m3u8",
    title: "ONICKS -＂Illuminati＂ (Official Lyric Video)",
    duration: "3:14",
    cover: cover2,
  },
  {
    src: "/music/Unholy (Sam Smith) 【covered by Anna ft. @chloebreez】｜ dual POV ver/index.m3u8",
    title: "Unholy (Sam Smith) 【covered by Anna ft. @chloebreez】｜ dual POV ver",
    duration: "2:20",
    cover: cover3,
  },
];

export function MusicList() {
  return (
    <main className={styles.main}>
      <ul className={styles.musicList}>
        {sources.map(({ src, title, duration, cover }) => (
          <li key={src}>
            <div>
              <Image src={cover} alt={title} width={30} height={30} unoptimized />
              <span>{title}</span>
            </div>
            
            <div>
              <span>{duration}</span>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
