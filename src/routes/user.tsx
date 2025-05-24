import { A, AccessorWithLatest, createAsync } from "@solidjs/router";
import {
  createResource,
  InitializedResourceReturn,
  ResourceFetcher,
  ResourceReturn,
  Suspense,
} from "solid-js";
import { decode } from "turbo-stream";
import Counter from "~/components/Counter";
import { User } from "./api";

const getUser = async () => {
  const res = await fetch("http://localhost:3001/api");

  if (!res.body) throw new Error("what?");

  return decode<User>(res.body.pipeThrough(new TextDecoderStream()));
};

type ToAccessor<T, R> =
  T extends Promise<infer U>
    ? InitializedResourceReturn<ToAccessor<U, R> | undefined>
    : {
        [K in keyof T]: ToAccessor<T[K] | undefined, R>;
      };

function isPromise<T>(value: unknown): value is Promise<T> {
  return value instanceof Promise;
}

function toResource<T, R>(value: T): ToAccessor<T, R> {
  if (isPromise(value)) return createTurbo<T, R>(() => value) as any;

  if (typeof value === "object") {
    if (!value) return value as any;
    const result = { ...value } as Record<string, any>;

    for (const [key, objValue] of Object.entries(value)) {
      if (objValue instanceof Promise) {
        result[key] = createTurbo(() => objValue) as any;
      }

      if (objValue && typeof objValue === "object") {
        result[key] = toResource(objValue);
      }
    }
    return result as any;
  }

  return value as any;
}

function createTurbo<T, R>(fetcher: ResourceFetcher<true, T, R>) {
  const [data, actions] = createResource(fetcher);

  return [
    () => {
      const res = data();

      return toResource(res);
    },
    actions,
  ] as const;
}

export default function About() {
  const [user] = createTurbo(getUser);

  const [info] = user()?.extraInfo || [];

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        {user()?.username}
      </h1>
      <Suspense fallback={<p>Loading...</p>}>
        <p>{info?.()?.bio}</p>
      </Suspense>
    </main>
  );
}
