import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Ok ChatGPT</title>
        <meta name="description" content="A easy way to chat with ChatGPT." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h4 className={styles.title}>
          Ok ChatGPT
        </h4>
        <div>点击下方按钮开始对话!</div>
        <div className={styles.grid}>
          <Link href="/chat" className={styles.card}>
            <h3>开始对话 &rarr;</h3>
          </Link>
        </div>

      </main>

      <footer className={styles.footer}>
        <a
          href="https://openai.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" OpenAI"}
        </a>
      </footer>
    </div>
  );
}
