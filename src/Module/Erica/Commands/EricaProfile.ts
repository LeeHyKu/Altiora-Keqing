import { Chat } from "node-kakao";
import ChannelData from "../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../Core/Citius/User/UserData";
import Command from "../../../Core/Fortius/Command/Command";
import Erica from "../Component/Erica";
import LevelRanker from "../Ranker/Level/LevelRanker";
import MoneyRanker from "../Ranker/Money/MoneyRanker";

export default class EricaProfile extends Command {
	readonly command = '프로필';

	readonly preview = '레벨,돈 등 자신의 상태를 확인합니다';
	readonly information = [
		{ info: '자신의 상태를 불러옵니다' },
		{ arg: '<@유저맨션>', info: '맨션한 유저의 상태를 불러옵니다' },
		{ arg: '레벨', info: '레벨 순위를 불러옵니다' },
		{ arg: '레벨전체', info: '모든 방의 레벨 순위를 불러옵니다' },
		{ arg: '돈', info: '돈 순위를 불러옵니다' },
		{ arg: '돈전체', info: '모든 방의 돈 순위를 불러옵니다' },
		{ arg: '알림', info: '레벨업 알림을 끄거나 킵니다' },
	];

	public async Prefix(chat: Chat, user: UserData, channel: ChannelData) {
		(await user.GetComponent(Erica).Profile()).SendChat(chat);
	}
	public async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) {
		switch (args[0]) {
			case '레벨':
			case '레벨순위':
			case '경험치':
			case '경험치순위':
				await (await this.Citius.GetSingleton(LevelRanker).KarinList(3, chat.Channel)).SendChat(chat);
				break;
			case '레벨전체':
			case '레벨순위전체':
			case '경험치전체':
			case '경험치순위전체':
				await (await this.Citius.GetSingleton(LevelRanker).KarinList(3)).SendChat(chat);
				break;
			case '돈':
			case '돈순위':
				await (await this.Citius.GetSingleton(MoneyRanker).KarinList(3, chat.Channel)).SendChat(chat);
				break;
			case '돈전체':
			case '돈전체순위':
				await (await this.Citius.GetSingleton(MoneyRanker).KarinList(3)).SendChat(chat);
				break;
			case '알림':
			case '알람': {
				let confirm = user.GetComponent(Erica).ToggleAlarm();
				await this.Karin.Confirm(`프로필 알림을 ${confirm ? '설정하였습니다' : '해제하였습니다'}`, '프로필 알림설정').SendChat(chat);
			}
				break;
			default:
				if (chat.getMentionContentList().length < 1) await this.Prefix(chat, user, channel);
				else await (await (await this.Citius.User.Find(chat.getMentionContentList()[0].UserId, chat.Channel)).GetComponent(Erica).Profile()).SendChat(chat);
				break;
		}
	}
}