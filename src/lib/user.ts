import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.MONGODB_DB_NAME ?? "stock_ai";
const USERS_COLLECTION = "users";

type BaseUser = {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export type User = BaseUser;

async function getUsersCollection() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection<BaseUser>(USERS_COLLECTION);
  await collection.createIndex({ email: 1 }, { unique: true });
  return collection;
}

export async function findUserByEmail(email: string) {
  const collection = await getUsersCollection();
  return collection.findOne({ email });
}

export async function createUser(user: {
  name: string;
  email: string;
  password: string;
}) {
  const collection = await getUsersCollection();
  const now = new Date();
  const result = await collection.insertOne({
    name: user.name,
    email: user.email,
    password: user.password,
    createdAt: now,
    updatedAt: now,
  } as BaseUser);

  return collection.findOne({ _id: result.insertedId });
}
