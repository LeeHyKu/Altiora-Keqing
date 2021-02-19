import { Chat } from "node-kakao";
import ChannelData from "../../../Citius/Channel/ChannelData";
import UserData from "../../../Citius/User/UserData";
import Keqing from "../../../Keqing";
import Checker from "../Checker";

export default class BlackTags extends Checker {
	private _disallowTags: string[];
	constructor(base: Keqing, ...tags: string[]) { super(base); this._disallowTags = tags; }

	public Check(issued: string, chat: Chat, user: UserData, channel: ChannelData): boolean {
		return user.HasTag('DEV') || !this._disallowTags.some(e =>
			(
				user.HasTag(`DISALLOW:ALL`) &&
				!(user.HasTag(`ALLOW:${e}`) || user.HasTag(`ALLOW:${issued}`))
			) ||
			(
				channel.HasTag(`DISALLOW:ALL`) &&
				!(channel.HasTag(`ALLOW:${e}`) || channel.HasTag(`ALLOW:${issued}`))
			) ||
			user.HasTag(`DISALLOW:${e}`) ||
			channel.HasTag(`DISALLOW:${e}`)
		);
	}
	public async OnRejection(issued: string, chat: Chat, user: UserData, channel: ChannelData) {
		await this.Karin.Reject('서비스이용제한목록에 등재되어있는 유저입니다. 본 채팅봇의 관리자에게 문의해주시기 바랍니다.', '서비스이용제한대상').SendChat(chat);
	}
}