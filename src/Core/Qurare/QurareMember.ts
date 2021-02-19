import SchemaCustom from "../Citius/SchemaCustom";
import Gravity from "./Gravity";

export default interface QurareMember extends SchemaCustom {
	level: Gravity,
	issued: Date,
	content: string,
	origin?: any
}