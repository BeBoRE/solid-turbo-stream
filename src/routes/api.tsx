import { encode } from "turbo-stream";

function delay<T>(delay: number, value: T) {
  return new Promise<T>((resolve) => setTimeout(() => resolve(value), delay));
}

const queryUser = async () => {
  return {
    id: 1,
    username: "BeBoRE",
    extraInfo: delay(2000, {
      bio: "Greatest bio you'll have ever seen",
      socials: delay(3000, {
        github: "https://github.com/bebore",
      }),
    }),
  };
};

export { queryUser };

export type User = ReturnType<typeof queryUser>;

export async function GET() {
  const stream = encode(await queryUser());

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "X-Accel-Buffering": "no",
    },
  });
}
