import { Chat, ChatMention } from "node-kakao";
import ChannelData from "../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../Core/Citius/User/UserData";
import Command from "../../../Core/Fortius/Command/Command";
import PvPBattle from "../Battle/PvP/PvPBattle";

export default class OdinDuelCommand extends Command {
	readonly command = '전투';

	async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) {
		switch (args[0]) {
			case '신청':
				if (chat.getMentionContentList().length < 1) await this.Karin.Reject('유저 맨션이 필요합니다', '유저맨션필요').SendChat(chat);
				else {//TODO: Check mentioned self
					var info = chat.Channel.getUserInfo(chat.Sender);
					var focus = chat.Channel.getUserInfoId(chat.getMentionContentList()[0].UserId);
					await chat.replyText(new ChatMention(focus));
					await this.Nakiri.CKarin(`${info.Nickname}님이 전투를 신청했습니다`, false, '전투신청').SendChat(chat);
					var confirm = await this.Nakiri.Confirm(focus.User, false, 10000);
					if (!confirm.result) await this.Karin.Reject('전투를 거부했습니다', '전투거부').SendChat(chat);
					else {
						new PvPBattle(this.Keqing, channel, user, await this.Citius.User.Find(focus.Id, chat.Channel)).Start();
						await this.Karin.Confirm(`':공격'명령어로 공격하세요`, '전투를 시작합니다').SendChat(chat);
					}
				}
				break;
		}
	}
}