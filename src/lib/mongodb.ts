import "server-only";

import { env } from "@/env";
import { MongoClient, MongoClientOptions } from "mongodb";
import { cache } from "react";

const options: MongoClientOptions = {
  maxPoolSize: 10,
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
};

type MongoGlobal = {
  client?: MongoClient;
  promise?: Promise<MongoClient>;
};

const globalForMongo = globalThis as typeof globalThis & {
  __mongo?: MongoGlobal;
};

globalForMongo.__mongo ??= {};

function getClientPromise(): Promise<MongoClient> {
  const mongo = globalForMongo.__mongo!;

  if (!mongo.promise) {
    const client = new MongoClient(env.MONGODB_URI, options);
    mongo.client = client;
    mongo.promise = client.connect();
  }

  return mongo.promise;
}

export const getMongoClient = cache(async () => {
  const client = await getClientPromise();
  return client;
});

export const getMongoDb = cache(async () => {
  const client = await getMongoClient();
  return client.db(env.MONGODB_DB_NAME);
});

export default getMongoClient;
