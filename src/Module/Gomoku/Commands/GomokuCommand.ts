import { Chat, ChatMention } from "node-kakao";
import ChannelData from "../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../Core/Citius/User/UserData";
import RequireMention from "../../../Core/Fortius/Command/Checkers/RequireMention";
import Command from "../../../Core/Fortius/Command/Command";
import GomokuGame from "../Game/GomokuGame";

export default class GomokuCommand extends Command {
	readonly command = '오목';
	readonly checkers = [
		RequireMention
	];

	readonly preview = '오목을 시작합니다';
	readonly information = [
		{ arg: '<@유저맨션>', info: '오목을 시작합니다' }
	];

	async All(chat: Chat, user: UserData, channel: ChannelData) {
		var info = chat.Channel.getUserInfo(chat.Sender);
		var focus = chat.Channel.getUserInfoId(chat.getMentionContentList()[0].UserId);
		await chat.replyText(new ChatMention(focus));
		await this.Nakiri.CKarin(`${info.Nickname}님이 오목 게임을 신청했습니다`, false, '게임신청').SendChat(chat);
		var confirm = await this.Nakiri.Confirm(focus.User, false, 10000);
		if (!confirm.result) await this.Karin.Reject('게임을 거부했습니다', '게임거부').SendChat(chat);
		else {
			var game = new GomokuGame(this.Keqing, channel, user, await this.Citius.User.Find(focus.Id, chat.Channel))
			game.Start();
			await (await game.Feed()).SendChat(chat);
		}
	}
}