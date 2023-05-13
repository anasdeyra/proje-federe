import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import Appshell from "@/components/Appshell/Appshell";
import "@/styles/globals.css";
import { api } from "@/utils/api";
import { Global } from "@emotion/react";
import { Notifications } from "@mantine/notifications";

function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>Classroom</title>
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <SessionProvider>
        <MantineProvider
          theme={{
            /** Put your mantine theme override here */
            colorScheme: "light",
            primaryColor: "green",
            fontFamily: "Roboto, sans-serif",
            headings: {
              fontFamily: "Roboto, sans-serif",
            },
          }}
        >
          <Notifications />
          <Global
            styles={[
              "@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap');",
            ]}
          />
          <Appshell>
            <Component {...pageProps} />
          </Appshell>
        </MantineProvider>
      </SessionProvider>
    </>
  );
}

export default api.withTRPC(App);
