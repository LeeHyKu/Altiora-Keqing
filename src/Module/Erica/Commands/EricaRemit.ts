import { Chat } from "node-kakao";
import ChannelData from "../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../Core/Citius/User/UserData";
import RequireMention from "../../../Core/Fortius/Command/Checkers/RequireMention";
import Command from "../../../Core/Fortius/Command/Command";
import Erica from "../Component/Erica";

export default class EricaRemit extends Command {
	readonly command = '송금';
	readonly checkers = [RequireMention];

	readonly preview = '돈을 다른 유저에게 보냅니다';
	readonly information = [
		{ arg: '<숫자> <@유저맨션>', info: '돈을 다른 유저에게 보냅니다' }
	];

	async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) {
		if (isNaN(+args[0])) await this.Karin.Reject('숫자를 입력해주세요', '숫자입력필요').SendChat(chat);
		else {
			var num = +Math.max(Math.min(+args[0] || 0, user.GetComponent(Erica).Money), 0).toFixed(3);
			var target = await this.Citius.User.Find(chat.getMentionContentList()[0].UserId, chat.Channel);

			user.GetComponent(Erica).Money -= num;
			target.GetComponent(Erica).Money += num;

			var tinfo = await target.GetUserInfo();
			await this.Karin.Confirm(`${tinfo.Nickname}님에게 ${num}원을 전달했습니다.`, '송금완료').SendChat(chat);
		}
	}
}