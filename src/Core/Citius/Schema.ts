import { ObjectId } from "mongodb";
import ComponentRaw from "./ComponentRaw";

export default interface SchemaDefault {
	_id: ObjectId;
	tags: string[];
	component: { [ComponentName: string]: ComponentRaw };
}