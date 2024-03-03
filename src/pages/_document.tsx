import {Head, Html, Main, NextScript} from "next/document";

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        {/* favicon: /logo.png */}
        <link rel="icon" href="/logo.png"/>
        <meta name="theme-color" content="#FFFFFF"/>
      </Head>
      <body>
      <Main/>
      <NextScript/>
      </body>
    </Html>
  );
}
