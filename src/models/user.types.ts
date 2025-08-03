import { Document } from "mongoose";

interface UserLoginFields {
  email: string;
  password: string;
}

interface UserSignupFields extends UserLoginFields {
  name: string;
  age: number;
}

interface UserDocument extends UserSignupFields, Document {
  generateAuthToken(): string;
}

export { UserDocument, UserLoginFields, UserSignupFields };

