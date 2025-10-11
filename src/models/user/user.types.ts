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

export { UserDocument, UserLoginFields, UserModelFields };
