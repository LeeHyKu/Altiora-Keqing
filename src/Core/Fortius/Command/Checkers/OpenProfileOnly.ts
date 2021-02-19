import { Chat, OpenChatUserInfo } from "node-kakao";
import ChannelData from "../../../Citius/Channel/ChannelData";
import UserData from "../../../Citius/User/UserData";
import Checkable from "../Checkable";
import CheckerSimple from "../CheckerSimple";

export default class OpenProfileOnly extends CheckerSimple {
	public Check(issued: string, chat: Chat, user: UserData, channel: ChannelData, checkable: Checkable): boolean {
		return (chat.Channel.getUserInfo(chat.Sender) as OpenChatUserInfo).hasOpenProfile();
    }
	public async OnRejection(issued: string, chat: Chat, user: UserData, channel: ChannelData, checkable: Checkable) {
		return await this.Karin.Reject('오픈프로필 전용 명령어입니다','오픈프로필전용').SendChat(chat);
    }
}