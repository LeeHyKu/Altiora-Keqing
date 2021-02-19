import { ObjectId } from "mongodb";

export default interface LamyAccount {
	_id: ObjectId;
	userid: string;
	password: string;
}