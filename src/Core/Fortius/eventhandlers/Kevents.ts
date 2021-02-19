import { ChannelMetaStruct, ChannelMetaType, Chat, ChatChannel, ChatUser, ClientChatUser, DeleteAllFeed, FeedChat, InviteFeed, LeaveFeed, LocoKickoutType, Long, OpenChatChannel, OpenChatUserInfo, OpenJoinFeed, OpenKickFeed, OpenLinkDeletedFeed, OpenMemberType, OpenProfileType, OpenRewriteFeed, RelayEventType } from "node-kakao";

export default interface Kevents {
	[eventname: string]: any[] | [];

	//ChatEvents
	message: [chat: Chat];
	feed: [feed: FeedChat];
	message_read: [channel: ChatChannel, reader: ChatUser, readChatLogId: Long];
	message_deleted: [feed: FeedChat<DeleteAllFeed>];

	//UserEvents
	user_join: [channel: ChatChannel, user: ChatUser, feed?: FeedChat<OpenJoinFeed | InviteFeed>];
	user_left: [channel: ChatChannel, user: ChatUser, feed?: FeedChat<LeaveFeed | OpenKickFeed>];
	user_kicked: [channel: ChatChannel, user: ChatUser, feed?: FeedChat<OpenKickFeed>];
	profile_changed: [channel: OpenChatChannel, user: ChatUser, lastUserInfo: OpenChatUserInfo, changedProfileType: OpenProfileType];
	member_type_changed: [channel: OpenChatChannel, user: ChatUser, lastType: OpenMemberType];

	//ChannelEvents
	meta_changed: [channel: ChatChannel, type: ChannelMetaType, meta: ChannelMetaStruct, lastMeta: ChannelMetaStruct | null];

	//OpenChannelEvent
	message_hidden: [channel: OpenChatChannel, logId: Long, feed?: FeedChat<OpenRewriteFeed>];
	link_deleted: [channel: OpenChatChannel, feed: FeedChat<OpenLinkDeletedFeed>];
	link_hand_over_host: [channel: OpenChatChannel, newHost: ChatUser, prevHost: ChatUser];
	chat_event: [channel: OpenChatChannel, user: ChatUser, type: RelayEventType, count: number, logId: Long]; //이벤트채팅

	//ClientEvents
	login: [user: ClientChatUser];
	switch_server: [];
	disconnected: [reason: LocoKickoutType];
	error: [error: Error];
}