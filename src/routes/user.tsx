import {
  createResource,
  InitializedResource,
  ResourceFetcher,
  Suspense,
} from "solid-js";
import { decode } from "turbo-stream";
import { User } from "./api";

const getUser = async () => {
  const res = await fetch("http://localhost:3001/api");

  if (!res.body) throw new Error("what?");

  return decode<User>(res.body.pipeThrough(new TextDecoderStream()));
};

type ToAccessor<T> =
  T extends Promise<infer U>
    ? InitializedResource<ToAccessor<U> | undefined>
    : {
        [K in keyof T]: ToAccessor<T[K] | undefined>;
      };

function isPromise<T>(value: unknown): value is Promise<T> {
  return value instanceof Promise;
}

function toResource<T>(value: T): ToAccessor<T> {
  if (isPromise(value)) return createTurbo(() => value) as any;

  if (typeof value === "object") {
    if (!value) return value as any;
    const result = value as Record<string, unknown>;

    for (const [key, objValue] of Object.entries(value)) {
      result[key] = toResource(objValue);
    }
    return result as any;
  }

  return value as any;
}

function createTurbo<T, R>(fetcher: ResourceFetcher<true, T, R>) {
  const [data] = createResource(fetcher);

  return () => {
    const res = data();

    return toResource(res);
  };
}

export default function About() {
  const user = createTurbo(getUser);

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        {user()?.username}
      </h1>
      <Suspense fallback={<p>Loading...</p>}>
        <p>{user()?.extraInfo?.()?.bio}</p>
      </Suspense>
    </main>
  );
}
