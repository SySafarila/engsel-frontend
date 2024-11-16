import axios from "axios";
import { GetStaticPaths } from "next";
import { useEffect } from "react";

type User = {
  name: string;
  username: string;
};
type Users = {
  message: string;
  user: User[];
};

export default function User({ user }: { user: User }) {
  useEffect(() => {
    console.log(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <p>Name: {user.name}</p>
      <p>Username: {user.username}</p>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const users: Users = (await axios.get("http://localhost:3000/users")).data;
  const paths = users.user.map((user: User) => ({
    params: {
      username: String(user.username),
    },
  }));

  // We'll prerender only these paths at build time.
  // { fallback: 'blocking' } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: false };
};

export const getStaticProps = async ({
  params,
}: {
  params: { username: string };
}) => {
  try {
    let user = await axios.get(
      `http://localhost:3000/users/${params.username}`
    );
    user = user.data.user;
    console.log(user);

    return {
      props: {
        user,
      },
      revalidate: 60,
    };
  } catch {
    return {
      notFound: true,
      revalidate: 5,
    };
  }
};
