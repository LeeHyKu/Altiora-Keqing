import { Chat } from "node-kakao";
import ChannelData from "../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../Core/Citius/User/UserData";
import RequireMention from "../../../Core/Fortius/Command/Checkers/RequireMention";
import WhiteTags from "../../../Core/Fortius/Command/Checkers/WhiteTags";
import Command from "../../../Core/Fortius/Command/Command";
import Erica from "../Component/Erica";

export default class EricaManagement extends Command {
	readonly command = '에리카';
	readonly checkers = [new WhiteTags(this.Keqing, 'DEV'), RequireMention];

	async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) {
		var focus = (await this.Citius.User.Find(chat.getMentionContentList()[0].UserId, chat.Channel)).GetComponent(Erica);
		switch (args[0]) {
			case '돈':
				focus.Money += +args[1] || 0;
				await (await focus.Profile()).SendChat(chat);
				break;
		}
	}
}