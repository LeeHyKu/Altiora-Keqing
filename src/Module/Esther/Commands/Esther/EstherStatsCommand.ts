import { Chat } from "node-kakao";
import UserData from "../../../../Core/Citius/User/UserData";
import Command from "../../../../Core/Fortius/Command/Command";
import Esther from "../../Esther/Esther";

export default class EstherStatsCommand extends Command {
	readonly command = '스텟';

	async Prefix(chat: Chat, user: UserData) {
		await (await user.GetComponent(Esther).InfoCarousel()).SendChat(chat);
	}
}