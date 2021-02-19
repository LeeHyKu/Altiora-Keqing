import { Chat } from "node-kakao";
import ChannelData from "../../../Citius/Channel/ChannelData";
import UserData from "../../../Citius/User/UserData";
import Keqing from "../../../Keqing";
import Checker from "../Checker";

export default class WhiteTags extends Checker {
	private _allowTags: string[];
	constructor(base: Keqing, ...tags: string[]) { super(base); this._allowTags = tags; }

	public Check(issued: string, chat: Chat, user: UserData, channel: ChannelData): boolean {
		return user.HasTag('DEV') || this._allowTags.some(e =>
			user.HasTag(`ALLOW:${e}`) ||
			channel.HasTag(`ALLOW:${e}`)
		);
	}
	public async OnRejection(issued: string, chat: Chat, user: UserData, channel: ChannelData) {
		await this.Karin.Reject('본 명령어는 허용된 사람만 사용이 가능한 명령어입니다.', '화이트리스트 명령어').SendChat(chat);
	}
}