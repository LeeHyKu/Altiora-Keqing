import { ObjectId } from "mongodb";

export default interface LamyAuth {
	oid: ObjectId;
	email: string;
	token: string;
}