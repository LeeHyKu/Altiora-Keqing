import { Chat } from "node-kakao";
import ChannelData from "../../../Citius/Channel/ChannelData";
import UserData from "../../../Citius/User/UserData";
import CheckerSimple from "../CheckerSimple";

/**
 * ESSENTIAL
 */
export default class CheckTags extends CheckerSimple {
	public Check(issued: string, chat: Chat, user: UserData, channel: ChannelData): boolean {
		return user.HasTag('DEV') || (
			(
				!user.HasTag(`DISALLOW:ALL`) ||
				user.HasTag(`ALLOW:${issued}`)
			) &&
			(
				!channel.HasTag(`DISALLOW:ALL`) ||
				channel.HasTag(`ALLOW:${issued}`)
			) &&
			!user.HasTag(`DISALLOW:${issued}`) &&
			!channel.HasTag(`DISALLOW:${issued}`)
		);
	}
	public async OnRejection(issued: string, chat: Chat, user: UserData, channel: ChannelData) {
		await this.Karin.Reject(`현재 귀하는 '서비스제공거부대상자목록'에 등재되어 있습니다. 본 채팅봇의 관리자에게 문의해주시기 바랍니다.`, '서비스제공거부대상').SendChat(chat);
	}
}