import { Chat, ChatMention, OpenChatChannel } from "node-kakao";
import ChannelData from "../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../Core/Citius/User/UserData";
import OpenChatOnly from "../../../Core/Fortius/Command/Checkers/OpenChatOnly";
import Command from "../../../Core/Fortius/Command/Command";

export default class BusterCall extends Command {
	readonly command = '버스터콜';
	readonly aliases = ['관리자호출'];
	readonly cooltime = 60000;
	readonly checkers = [OpenChatOnly];

	readonly preview = '해당 채팅방의 모든 관리자를 호출합니다';

	async All(chat: Chat, user: UserData, channel: ChannelData) {
		if (!channel.CheckCool('buster')) await this.Karin.Reject('잠시후에 다시 시도해주세요.', '쿨타임').SendChat(chat);
		else {
			await chat.replyText(...chat.Channel.getUserInfoList().filter(e => (<OpenChatChannel>chat.Channel).canManageChannelId(e.Id)).map(e => new ChatMention(e)));
			channel.SetCool('buster', 10000);
		}
	}
}