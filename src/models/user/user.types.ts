import { Document, mongo } from "mongoose";

interface UserDocument extends UserModelFields, Document {
  _id: mongo.ObjectId;
  generateAuthToken(): string;
}

interface UserModelFields extends UserLoginFields {
  name: string;
  age: number;
}

interface UserLoginFields {
  email: string;
  password: string;
}

interface UserStats {
  totalVisits: number;
  totalSpent: number;
  avgSpent: number;
  maxSpent: number;
  minSpent: number;
  uniqueBandsSeenCount: number;
  uniqueCitiesSeenCount: number;
  uniqueVenuesSeenCount: number;
  categoryCounts: Record<string, number>;
  bandCounts: Record<string, number>;
  cityCounts: Record<string, number>;
  venueCounts: Record<string, number>;
  yearCounts: Record<string, number>;
}

export { UserDocument, UserLoginFields, UserModelFields, UserStats };
