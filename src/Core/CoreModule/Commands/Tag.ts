import { Chat } from "node-kakao";
import ChannelData from "../../Citius/Channel/ChannelData";
import UserData from "../../Citius/User/UserData";
import WhiteTags from "../../Fortius/Command/Checkers/WhiteTags";
import Command from "../../Fortius/Command/Command";

export default class Tag extends Command {
	readonly command = '태그';
	readonly checkers = [new WhiteTags(this.Keqing, 'DEV')];

	async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) {
		switch (args[0]) {
			case '채널':
				if (!args[1]) await this.Karin.Reject('태그를 입력해주세요', '태그 필요').SendChat(chat);
				else {
					var confirm = channel.ToggleTag(args[1]);
					await this.Karin.Confirm(`채널의 태그 ${args[1]}을(를) ${confirm ? '활성화' : '비활성화'} 했습니다`, confirm ? '태깅' : '언태깅').SendChat(chat);
				}
				break;
			default:
				if (chat.getMentionContentList().length < 1) await this.Karin.Reject('유저를 맨션해주세요', '유저맨션필요').SendChat(chat);
				else if (!args[1]) await this.Karin.Reject('태그를 입력해주세요', '태그 필요').SendChat(chat);
				else {
					var focus = await this.Citius.User.Find(chat.getMentionContentList()[0].UserId, chat.Channel);
					var confirm = focus.ToggleTag(args[0]);
					await this.Karin.Confirm(`해당 유저의 태그 ${args[0]}을(를) ${confirm ? '활성화' : '비활성화'} 했습니다`, confirm ? '태깅' : '언태깅').SendChat(chat);
				}
				break;
		}
	}
}