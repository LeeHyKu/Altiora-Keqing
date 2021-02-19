import { Long, UserInfo } from "node-kakao";
import Keqing from "../../../Keqing";
import Cacher from "../../base/Cacher";

const uptime = 60000;

export default class UserInfoCacher extends Cacher<UserInfo>{
	private _date: Date;

	constructor(keqing: Keqing, private user: string, private channel?: string) { super(keqing); }

	protected Check(): boolean {
		return Date.now() - this._date.getTime() < uptime;
    }
	protected OnUpdate() {
		this._date = new Date();
    }
	protected async Update(): Promise<UserInfo> {
		if (this.channel) return await this.Client.ChannelManager.get(Long.fromString(this.channel))?.getLatestUserInfoId?.(Long.fromString(this.user));
		else return (await this.Client.OpenLinkManager.get(Long.fromString(this.user)))?.LinkOwnerInfo;
    }
}