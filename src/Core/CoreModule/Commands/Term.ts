import { Chat, ChatMention } from "node-kakao";
import ChannelData from "../../Citius/Channel/ChannelData";
import UserData from "../../Citius/User/UserData";
import Command from "../../Fortius/Command/Command";

import * as termText from "../../../../res/Terms/Term.json";
import * as noshare from "../../../../res/Terms/NoShare.json";

export default class Term extends Command {
	readonly command = '약관';
	readonly term = false;
	readonly critical = true;

	readonly preview = '약관 동의 명령어';

	async All(chat: Chat, user: UserData, channel: ChannelData) {
		await chat.replyText(new ChatMention(chat.Channel.getUserInfo(chat.Sender)), ' 사용자 이용약관\n', '\u200b'.repeat(500), termText.content.replace(/{PREFIX}/g, channel.Prefix));
		await this.Nakiri.CKarin('이용약관에 동의하시나요?', false, '약관동의').SendChat(chat);
		if ((await this.Nakiri.Confirm(chat.Sender, false, 600000)).result) {
			await chat.replyText(new ChatMention(chat.Channel.getUserInfo(chat.Sender)), ' 추가 사용자 이용약관\n', '\u200b'.repeat(500), noshare.content);
			await this.Nakiri.CKarin('추가 이용약관에 동의하시나요?', false, '약관동의').SendChat(chat);
			if ((await this.Nakiri.Confirm(chat.Sender, false, 600000)).result) {
				user.Term = true;
				await this.Karin.Confirm('추가 이용약관에 동의하였습니다.', '추가이용약관동의완료').SendChat(chat);
			}
			else {
				user.Term = false;
				await this.Karin.Reject('추가 이용약관을 거부하였습니다.', '추가이용약관거부').SendChat(chat);
			}
		}
		else {
			user.Term = false;
			await this.Karin.Reject('이용약관을 거부하였습니다.', '이용약관거부').SendChat(chat);
		}
	}
}