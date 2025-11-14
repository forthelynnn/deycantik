import Head from "next/head";
import UGCGenerator from "../components/UGCGenerator";

export default function Home() {
  return (
    <>
      <Head>
        <title>UGC Outfit Generator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="container p-6">
        <UGCGenerator />
      </div>
    </>
  );
}
