import { Document } from "mongoose";

interface UserLoginFields {
  email: string;
  password: string;
}

interface UserModelFields extends UserLoginFields {
  name: string;
  age: number;
}

interface UserDocument extends UserModelFields, Document {
  generateAuthToken(): string;
}

export { UserDocument, UserLoginFields, UserModelFields };

