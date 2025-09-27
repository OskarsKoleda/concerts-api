import { Document } from "mongoose";

interface UserDocument extends UserModelFields, Document {
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
