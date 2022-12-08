import { createParser } from "eventsource-parser";
import { streamAsyncIterable } from "./stream-async-iterable.mjs";

export async function fetchSSE(resource, options) {
  const { onMessage, onError, ...fetchOptions } = options;
  try {
    const resp = await fetch(resource, fetchOptions);
    const parser = createParser((event) => {
      if (event.type === "event") {
        onMessage(event.data);
      }
    });
    for await (const chunk of streamAsyncIterable(resp.body)) {
      const str = new TextDecoder().decode(chunk);
      parser.feed(str);
    } 
  } catch (error) {
    onError(error);
  }
}