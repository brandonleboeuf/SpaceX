import Head from "next/head";
import { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import styles from "../styles/Home.module.css";

export default function Home({ launches }) {
  console.log("launchs", launches);

  const [launchNum, setLaunchNum] = useState(10);

  return (
    <div className={styles.container}>
      <Head>
        <title>SpaceX Launches App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>SpaceX Launches</h1>

        <p className={styles.description}>Latest launches from SpaceX</p>
        <p>GraphQL will be used to get data from:</p>
        <code className={styles.code}>https://spacex.land/</code>

        <div className={styles.grid}>
          {!launches
            ? "Loading..."
            : launches.slice(2, launchNum).map((launch) => {
                return (
                  <a
                    key={launch.id}
                    href={launch.links.video_link}
                    href={launch.links.article_link}
                    className={styles.card}
                  >
                    <div>
                      <h3>Mission Name: {launch.mission_name}</h3>
                      <p>
                        <strong>Rocket Type:</strong>{" "}
                        {launch.rocket.rocket_name}
                      </p>
                      <img
                        src={launch.links.mission_patch}
                        style={{
                          maxWidth: "200px",
                          maxHeight: "200px",
                          margin: "15px",
                          float: "right",
                        }}
                      />
                      <p>
                        <strong>Launch Time: </strong>
                        {new Date(launch.launch_date_local).toLocaleDateString(
                          "en-US"
                        )}
                      </p>
                      <div>
                        <p>
                          <strong>Details: </strong>
                          {launch.details ? launch.details : "N/A"}
                        </p>
                      </div>
                    </div>
                  </a>
                );
              })}
        </div>
        <button
          onClick={() => {
            setLaunchNum(launchNum + 10);
          }}
          className={styles.btn}
        >
          Load More
        </button>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://brandon-leboeuf.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          built by Ⓑrandon
        </a>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: "https://api.spacex.land/graphql",
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
      {
        launchesPast {
          id
          mission_name
          launch_date_local
          launch_site {
            site_name_long
          }
          links {
            article_link
            video_link
            mission_patch
          }
          rocket {
            rocket_name
          }
          details
        }
      }
    `,
  });

  // console.log("data", data);

  return {
    props: {
      launches: data.launchesPast,
    },
  };
}
