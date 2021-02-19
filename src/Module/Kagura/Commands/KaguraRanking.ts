import { Chat } from "node-kakao";
import ChannelData from "../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../Core/Citius/User/UserData";
import Command from "../../../Core/Fortius/Command/Command";
import ChannelChatDayRanker from "../ChannelRanker/Day/ChannelChatDayRanker";
import ChannelChatMonthRanker from "../ChannelRanker/Month/ChannelChatMonthRanker";
import ChannelChatSagaRanker from "../ChannelRanker/Saga/ChannelChatSagaRanker";
import ChannelChatWeekRanker from "../ChannelRanker/Week/ChannelChatWeekRanker";

export default class KaguraRanking extends Command {
	readonly command = '채팅';

	readonly preview = '채팅량 순위를 확인합니다';
	readonly information = [
		{ info: '일간 채팅량 순위를 확인합니다' },
		{ arg: '주간', info: '주간 채팅량 순위를 확인합니다' },
		{ arg: '월간', info: '월간 채팅량 순위를 확인합니다' },
		{ arg: '전체', info: '전체 채팅량 순위를 확인합니다' }
	];

	async Prefix(chat: Chat, user: UserData, channel: ChannelData) { await this.Args(chat, ['순위'], user, channel); }
	async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) {
		switch (args[0]) {
			case '순위':
			case '랭킹':
			case '일간':
			case '일간순위':
			case '일간랭킹':
			case '일베':
				await (await this.Citius.GetSingleton(ChannelChatDayRanker).KarinList(5)).SendChat(chat);
				break;
			case '주간':
			case '주간순위':
			case '주간랭킹':
				await (await this.Citius.GetSingleton(ChannelChatWeekRanker).KarinList(5)).SendChat(chat);
				break;
			case '월간':
			case '월간순위':
			case '월간랭킹':
				await (await this.Citius.GetSingleton(ChannelChatMonthRanker).KarinList(5)).SendChat(chat);
				break;
			case '전체':
			case '전체순위':
			case '전체랭킹':
				await (await this.Citius.GetSingleton(ChannelChatSagaRanker).KarinList(5)).SendChat(chat);
				break;
		}
	}
}