import { getCookie, setCookie } from "cookies-next";
import createClient from "openapi-fetch";
import { v4 as uuidv4 } from "uuid";

import { ResponseError } from "@/types/base";

const DEFAULT_HEADERS = {
  Accept: "application/json",
};

const client = createClient<any>({
  referrerPolicy: "no-referrer-when-downgrade",
  headers: DEFAULT_HEADERS,
  querySerializer: {
    array: {
      style: "form",
      explode: false,
    },
  },
});

async function constructHeaders(headersInit?: HeadersInit | undefined) {
  const requestId = uuidv4();
  const headers = new Headers(headersInit);

  headers.set("X-Request-Id", requestId);

  return headers;
}

client.use({
  async onRequest({ request }) {
    const headers = await constructHeaders();
    headers.forEach((v, k) => request.headers.set(k, v));

    return request;
  },

  async onResponse({ request, response }) {
    try {
      const body = await response.clone().json();

      body.code = response.status;
      body.requestid = request.headers.get("X-Request-Id");

      return new Response(JSON.stringify(body), {
        headers: response.headers,
        status: response.status,
        statusText: response.statusText,
      });
    } catch {
      //noop
    }

    return response;
  },
});

export const { GET: get, POST: post } = client;

export const handleError = (error: unknown): never => {
  if (error && typeof error === "object") {
    const errorMessage =
      "msg" in error && typeof error.msg === "string"
        ? error.msg
        : "message" in error && typeof error.message === "string"
        ? error.message
        : undefined;

    const errorCode =
      "code" in error && typeof error.code === "number"
        ? error.code
        : undefined;
    const requestId =
      "requestId" in error && typeof error.requestId === "string"
        ? error.requestId
        : undefined;

    if (errorMessage) {
      throw new ResponseError(errorMessage, errorCode, requestId);
    }
  }

  if (error !== null && typeof error === "object" && "stack" in error) {
    console.error(error.stack);
  }

  throw new ResponseError(undefined);
};
