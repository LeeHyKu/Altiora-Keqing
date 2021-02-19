import { Chat } from "node-kakao";
import ChannelData from "../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../Core/Citius/User/UserData";
import Command from "../../../Core/Fortius/Command/Command";
import FeedBuilder from "../../../Core/Karin/Contents/Feed/FeedBuilder";

export default class MyInfo extends Command {
	readonly command = '유저정보';

	readonly preview = '유저의 정보를 확인합니다';

	async Prefix(chat: Chat, user: UserData, channel: ChannelData) { await (await this.InfoKarin(user)).SendChat(chat); }
	async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) {
		if (chat.getMentionContentList().length > 0) {
			var target = await this.Citius.User.Find(chat.getMentionContentList()[0].UserId, chat.Channel);
			await (await this.InfoKarin(target)).SendChat(chat);
		}
		else await this.Prefix(chat, user, channel);
	}

	private async InfoKarin(user: UserData): Promise<FeedBuilder> {
		var info = await user.GetUserInfo();
		return this.Karin.Feed('유저정보').TextFull(true).Profile({
			TD: { T: info.Nickname },
			TH: { THU: info.ProfileImageURL, H: 200, W: 200 },
		}).Text({
			T: `유저정보`,
			D: `개인식별코드\r\n${user.ID.toHexString()}\r\n유저식별코드\r\n${user.UserID}`
		}).Button({
			BU: {
				T: '프로필사진'
			},
			L: {
				LPC: info.OriginalProfileImageURL,
				LMO: info.OriginalProfileImageURL
			}
		});
	}
}