import { ObjectId } from "mongodb";
import ItemRaw from "../../ItemRaw";

export default interface ContractRaw extends ItemRaw {
	content: string;
	contractor: ObjectId;
	assignee?: ObjectId;
}