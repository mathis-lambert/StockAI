import "server-only";

import { ObjectId } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";

const PORTFOLIO_COLLECTION = "portfolio_positions";

export type PortfolioPositionDocument = {
  _id: ObjectId;
  userId: ObjectId;
  symbol: string;
  quantity: number;
  averagePrice: number;
  createdAt: Date;
  updatedAt: Date;
};

async function getPortfolioCollection() {
  const db = await getMongoDb();
  const collection =
    db.collection<PortfolioPositionDocument>(PORTFOLIO_COLLECTION);

  await collection.createIndex({ userId: 1, symbol: 1 });

  return collection;
}

function toObjectId(id: string) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Identifiant invalide");
  }
  return new ObjectId(id);
}

export async function listPositionsForUser(userId: string) {
  const collection = await getPortfolioCollection();
  const userObjectId = toObjectId(userId);

  return collection
    .find({ userId: userObjectId })
    .sort({ updatedAt: -1 })
    .toArray();
}

export async function createPositionForUser(
  userId: string,
  data: {
    symbol: string;
    quantity: number;
    averagePrice: number;
  },
) {
  const collection = await getPortfolioCollection();
  const userObjectId = toObjectId(userId);
  const now = new Date();

  const normalized = {
    _id: new ObjectId(),
    userId: userObjectId,
    symbol: data.symbol,
    quantity: data.quantity,
    averagePrice: data.averagePrice,
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(normalized);

  return collection.findOne({ _id: result.insertedId });
}

export async function updatePositionForUser(
  userId: string,
  positionId: string,
  data: {
    symbol: string;
    quantity: number;
    averagePrice: number;
  },
) {
  const collection = await getPortfolioCollection();
  const userObjectId = toObjectId(userId);
  const positionObjectId = toObjectId(positionId);

  await collection.updateOne(
    { _id: positionObjectId, userId: userObjectId },
    {
      $set: {
        symbol: data.symbol,
        quantity: data.quantity,
        averagePrice: data.averagePrice,
        updatedAt: new Date(),
      },
    },
  );

  return collection.findOne({
    _id: positionObjectId,
    userId: userObjectId,
  });
}

export async function deletePositionForUser(
  userId: string,
  positionId: string,
) {
  const collection = await getPortfolioCollection();
  const userObjectId = toObjectId(userId);
  const positionObjectId = toObjectId(positionId);

  const result = await collection.deleteOne({
    _id: positionObjectId,
    userId: userObjectId,
  });

  return result.deletedCount === 1;
}
