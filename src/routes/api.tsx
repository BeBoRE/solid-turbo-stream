import { encode } from "turbo-stream";

function delay<T>(delay: number, value: T) {
  return new Promise<T>((resolve) => setTimeout(() => resolve(value), delay));
}

const queryUser = async () => {
  return {
    id: 1,
    username: "BeBoRE",
    extraInfo: delay(2000, {
      bio: "Greatest bio I have ever seen",
      socials: delay(3000, {
        github: "https://github.com/bebore",
      }),
    }),
  };
};

export type User = ReturnType<typeof queryUser>;

export async function GET() {
  const stream = encode(queryUser());

  return new Response(stream, {
    headers: { "Content-Type": "text/plain" },
  });
}
