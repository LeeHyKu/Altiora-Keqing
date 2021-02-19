import { Chat, CustomType } from "node-kakao";
import ChannelData from "../../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../../Core/Citius/User/UserData";
import WhiteTags from "../../../../Core/Fortius/Command/Checkers/WhiteTags";
import Command from "../../../../Core/Fortius/Command/Command";
import Feed from "../../../../Core/Karin/Contents/Feed/Feed";
import Inventory from "../../Inventory/Inventory";
import Preset from "../../Venti/Preset/Preset";

export default class VentiProvisionCommand extends Command {
	readonly command = '지급';
	readonly checkers = [new WhiteTags(this.Keqing, 'DEV')];

	readonly preview = '채팅봇 관리자용 아이템 지급 명령어';
	readonly information = [
		{ arg: '<아이템 이름> [<@유저맨션>]', info: '유저의 인벤토리에 아이템을 추가함' },
		{ arg: '목록', info: '프리셋 리스트 출력' },
	];

	async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) {
		switch (args[0]) {
			case '목록':
				await this.Citius.GetSingleton(Preset).InfoCarousel().SendChat(chat);
				break;
			default:
				var target = chat.getMentionContentList().length < 1 ? user : await this.Citius.User.Find(chat.getMentionContentList()[0].UserId, chat.Channel);
				var item = this.Citius.GetSingleton(Preset).GetItem(args[0].replace(/_/,' '), target);
				if (!item) await this.Karin.Reject('알 수 없는 아이템입니다', '프리셋 없음').SendChat(chat);
				else {
					target.GetComponent(Inventory).AddItem(item);
					var info = await target.GetUserInfo();
					await this.Karin.Carousel<Feed>(CustomType.FEED, '실행성공').add(
						this.Karin.Confirm(`${info.Nickname}의 인벤토리에 아이템 ${item.Name}을 추가했습니다.`, '추가완료').Profile({ TD: { T: info.Nickname }, TH: { THU: info.ProfileImageURL, H: 200, W: 200 } }),
						item.Feed()
					).SendChat(chat);
				}
				break;
		}
	}
}