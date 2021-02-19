import { Chat } from "node-kakao";
import UserData from "../../../Core/Citius/User/UserData";
import Command from "../../../Core/Fortius/Command/Command";
import Erica from "../Component/Erica";
import Attandance from "../Ranker/Attandance/AttandanceRanker";

export default class EricaAttandance extends Command {
	readonly command = '출석';
	readonly aliases = ['\u200bㅊㅊ'];
	readonly term = false;

	public async Prefix(chat: Chat, user: UserData) {
		await (await user.GetComponent(Erica).Attend(chat.Channel)).SendChat(chat);
	}

	public async Args(chat: Chat, args: string[], user: UserData) {
		switch (args[0]) {
			case '순위':
			case '랭킹':
				await (await this.Citius.GetSingleton(Attandance).KarinList(3, chat.Channel)).SendChat(chat);
				break;
			case '전체':
			case '전체순위':
			case '전체랭킹':
				await (await this.Citius.GetSingleton(Attandance).KarinList(3)).SendChat(chat);
				break;
			default:
				await this.Prefix(chat, user);
				break;
		}
	}
}