import { FilterQuery, Collection } from "mongodb";
import { ChatChannel, Long, OpenChatUserInfo } from "node-kakao";
import Keqing from "../../Keqing";
import Table from "../base/Table";
import { SchemaMarge } from "../Types";
import UserData from "./UserData";
import UserQuery from "./UserQuery";
import UserSchema from "./UserSchema";

export default class UserTable extends Table<UserQuery, UserSchema, UserData> {
	constructor(base: Keqing, collection: Collection<SchemaMarge<UserSchema>>) { super(base, collection, UserData); }
	protected Query(user: Long, channel: ChatChannel): FilterQuery<SchemaMarge<UserSchema>> {
		var info = <OpenChatUserInfo>channel.getUserInfoId(user);
		var query: FilterQuery<SchemaMarge<UserSchema>> = { _user: info.hasOpenProfile?.() ? info.ProfileLinkId.toString() : user.toString() };
		if (!info.hasOpenProfile?.()) query.channel = channel.Id.toString();
		return query;
	}
}