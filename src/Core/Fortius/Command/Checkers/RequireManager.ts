import { Chat } from "node-kakao";
import ChannelData from "../../../Citius/Channel/ChannelData";
import UserData from "../../../Citius/User/UserData";
import CheckerSimple from "../CheckerSimple";

export default class RequireManager extends CheckerSimple {
	public Check(issued: string, chat: Chat, user: UserData, channel: ChannelData): boolean { return channel.CanBotManage; }
	public async OnRejection(issued: string, chat: Chat, user: UserData, channel: ChannelData) {
		await this.Karin.Reject('채팅봇에게 관리권한이 필요합니다.', '관리권한 필요').SendChat(chat);
	}
}