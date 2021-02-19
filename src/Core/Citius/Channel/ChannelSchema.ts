import SchemaCustom from "../SchemaCustom";

export default interface ChannelSchema extends SchemaCustom {
	_channel: string;
	prefix?: string;
	cooltime?: number;
	hidewarning?: boolean;
	bancommands?: string[];
	managers: string[];
	botusers: string[];
}