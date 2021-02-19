import { ChatChannel, CustomImageCropStyle, Long, OpenChatChannel, OpenChatUserInfo, UserInfo } from "node-kakao";
import Profile from "../../Karin/Items/Profile";
import ProfileBuilder from "../../Karin/Items/ProfileBuilder";
import Data from "../base/Data";
import UserInfoCache from "./UserInfoCache/UserInfoCache";
import UserQuery from "./UserQuery";
import UserSchema from "./UserSchema";
import UserTable from "./UserTable";

export default class UserData extends Data<UserQuery, UserSchema, UserTable>{
	private userid: string;
	private channelid?: string;
	private term: boolean;
	public get UserID() { return this.userid; }
	public get isSyncUser() { return !this.channelid; }
	public get LocalChannelId() { return this.channelid; } //NULLABLE
	public get Term() { return this.term; }
	public set Term(arg: boolean) { this.term = arg; }

	public Check(user: Long, channel: ChatChannel): boolean { try { if (this.channelid) return channel.Id.toString() === this.channelid && user.toString() === this.UserID; else return (<OpenChatUserInfo>channel.getUserInfoId(user))?.ProfileLinkId?.toString?.() === this.UserID; } catch { return false; } }
	protected Initialization(user: Long, channel: ChatChannel): UserSchema {
		var info = <OpenChatUserInfo>channel.getUserInfoId(user);
		return {
			_user: info.hasOpenProfile?.() ? info.ProfileLinkId.toString() : user.toString(),
			channel: info.hasOpenProfile?.() ? null : channel.Id.toString(),
			term: false
		};
	}
	protected Installation(raw: UserSchema) {
		this.userid = raw._user;
		if (raw.channel) this.channelid = raw.channel;
		this.term = raw.term;
	}
	protected ToRaw(): UserSchema {
		return {
			_user: this.userid,
			channel: this.channelid || null,
			term: this.term
		};
	}

	public JoinedChannel(channel: ChatChannel) { try { if (this.channelid) return this.channelid === channel.Id.toString(); else return channel.isOpenChat() && (channel as OpenChatChannel).getUserInfoList().some(e => e.ProfileLinkId?.toString?.() === this.UserID); } catch { return false; } }
	public async GetUserInfo(): Promise<UserInfo> { return await this.Citius.GetSingleton(UserInfoCache).GetUserInfo(this.ID.toHexString(), this.UserID, this.channelid); }
	public async GetProfile(): Promise<Profile> {
		var info = await this.GetUserInfo();
		return new ProfileBuilder({ T: info.Nickname }, { THU: info.ProfileImageURL, H: 200, W: 200, SC: CustomImageCropStyle.CENTER_CROP });
	}
}