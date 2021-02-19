import { ChatChannel, Long, OpenChatChannel } from "node-kakao";
import { isNullOrUndefined } from "util";
import Data from "../base/Data";
import ChannelQuery from "./ChannelQuery";
import ChannelSchema from "./ChannelSchema";
import ChannelTable from "./ChannelTable";

export default class ChannelData extends Data<ChannelQuery, ChannelSchema, ChannelTable> {
	private channelID: string;
	private prefix?: string;
	private cooltime?: number;
	private hidewarning?: boolean;
	private bancommands?: string[];
	private managers: string[];
	private botusers: string[];
	public get ChannelID() { return this.channelID; }
	public get Hidewarning() { return !!this.hidewarning; }
	public set Hidewarning(bool: boolean) { this.hidewarning = bool; }
	public get CanBotManage() { return (<OpenChatChannel>this.Channel)?.canManageChannel?.(this.Keqing.Client.ClientUser); }
	public CanUserManage(user: Long) { return (<OpenChatChannel>this.Channel)?.canManageChannelId?.(user) || this.managers.some(e => e == user.toString()); }
	public IsTrustManager(user: Long) { return (<OpenChatChannel>this.Channel)?.canManageChannelId?.(user); }
	public get Prefix() { return this.prefix || this.Keqing.Prefix; }
	public set Prefix(pfx: string) { this.prefix = pfx; }
	public get Cooltime() { return this.cooltime || 0; }
	public set Cooltime(num) { this.cooltime = num; }
	public get Managers() { return this.managers; }
	public ToggleManager(user: Long) { var index = this.managers.findIndex(e => e === user.toString()); if (index !== -1) { this.managers.splice(index, 1); return false; } else { this.managers.push(user.toString()); return true; } }
	public get BannedCommands() { return this.bancommands || []; }
	public CommandBanned(cid: string) { return this.BannedCommands.some(e => e === cid); }
	public ToggleBanCommand(cid: string) {
		if (!this.bancommands) this.bancommands = [];
		var index = this.bancommands.findIndex(e => e === cid); if (index !== -1) { this.bancommands.splice(index, 1); return false; } else { this.bancommands.push(cid); return true; }
	}
	public get BotUsers() { return this.botusers; }
	public isBotUser(user: Long) { return this.botusers.some(e => e === user.toString()); }
	public ToggleBotUser(user: Long) {
		var index = this.botusers.findIndex(e => e === user.toString()); if (index !== -1) { this.botusers.splice(index, 1); return false; } else { this.botusers.push(user.toString()); return true; }
	}

	private _channel: ChatChannel
	public get Channel() { return this._channel || (this._channel = this.Client.ChannelManager.get(Long.fromString(this.ChannelID))); }

	protected Initialization(channel: ChatChannel): ChannelSchema {
		return {
			_channel: channel.Id.toString(),
			managers: [],
			botusers: []
		};
	}
	protected Installation(raw: ChannelSchema) {
		this.channelID = raw._channel;
		if (raw.prefix) this.prefix = raw.prefix;
		if (raw.cooltime) this.cooltime = raw.cooltime;
		if (raw.hidewarning) this.hidewarning = raw.hidewarning;
		if (raw.bancommands) this.bancommands = raw.bancommands;
		this.managers = raw.managers;
		this.botusers = raw.botusers;
	}

	public Check(channel: ChatChannel): boolean { return this.ChannelID === channel?.Id?.toString?.(); }

	protected ToRaw(): ChannelSchema {
		var result: ChannelSchema = {
			_channel: this.ChannelID,
			managers: this.managers,
			botusers: this.botusers
		};

		if (this.prefix) result['prefix'] = this.prefix;
		if (!isNullOrUndefined(this.cooltime)) result['cooltime'] = this.cooltime;
		if (!isNullOrUndefined(this.hidewarning)) result['hidewarning'] = this.hidewarning;
		if (this.bancommands) result['bancommands'] = this.bancommands;

		return result;
	}
}