import SchemaCustom from "../SchemaCustom";

export default interface UserSchema extends SchemaCustom {
	_user: string;
	channel?: string;
	term: boolean;
}