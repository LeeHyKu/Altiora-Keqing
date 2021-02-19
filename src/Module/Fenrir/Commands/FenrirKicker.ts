import { Chat, CustomType, OpenChatChannel } from "node-kakao";
import ChannelData from "../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../Core/Citius/User/UserData";
import ForManagers from "../../../Core/Fortius/Command/Checkers/ForManagers";
import RequireManager from "../../../Core/Fortius/Command/Checkers/RequireManager";
import RequireMention from "../../../Core/Fortius/Command/Checkers/RequireMention";
import Command from "../../../Core/Fortius/Command/Command";
import Feed from "../../../Core/Karin/Contents/Feed/Feed";

export default class FenrirKicker extends Command {
	readonly command = '킥';
	readonly aliases = ['kick'];

	readonly preview = '여러개의 유저들을 한번에 내보내기 위한 채팅방 관리자용 명령어입니다.';
	readonly information = [
		{ arg: '...<@유저맨션>', info: '유저를 킥합니다. 한번에 최대 5명을 킥할 수 있습니다.' }
	];
	readonly checkers = [ForManagers, RequireManager, RequireMention];

	async All(chat: Chat, user: UserData, channel: ChannelData) {
		if (chat.getMentionContentList().length < 1) this.Karin.Reject('내보낼 유저를 맨션해주세요', '맨션필요').SendChat(chat);
		else {
			var carousel = this.Karin.Carousel<Feed>(CustomType.FEED, '결과')
			for (var { UserId } of chat.getMentionContentList().slice(0, 5)) {
				var info = chat.Channel.getUserInfoId(UserId);
				var res = await (chat.Channel as OpenChatChannel).kickMemberId(UserId);
				carousel.add((res ? this.Karin.Confirm(`${info.Nickname}가 사망했습니다.`, '날이 밝았습니다') : this.Karin.Reject(`${info.Nickname}을 내보내는데 실패했습니다.`, '킥 실패')));
			}
			await carousel.SendChat(chat);
		}
	}
}