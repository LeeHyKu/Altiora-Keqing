import { Collection, FilterQuery } from "mongodb";
import { ChatChannel } from "node-kakao";
import Keqing from "../../Keqing";
import Table from "../base/Table";
import { SchemaMarge } from "../Types";
import ChannelData from "./ChannelData";
import ChannelQuery from "./ChannelQuery";
import ChannelSchema from "./ChannelSchema";

export default class ChannelTable extends Table<ChannelQuery, ChannelSchema, ChannelData> {
	constructor(base: Keqing, collection: Collection<SchemaMarge<ChannelSchema>>) { super(base, collection, ChannelData); }
	protected Query(channel: ChatChannel): FilterQuery<SchemaMarge<ChannelSchema>> { return { _channel: channel.Id.toString() }; }
}