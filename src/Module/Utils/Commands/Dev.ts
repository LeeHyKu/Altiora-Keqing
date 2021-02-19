import { Chat } from "node-kakao";
import ChannelData from "../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../Core/Citius/User/UserData";
import Command from "../../../Core/Fortius/Command/Command";

const DevUrl = 'https://open.kakao.com/me/SkadiDevAlfa';

export default class Dev extends Command {
	readonly command = '개발자';
	readonly aliases = ['후원'];
	readonly term = false;

	readonly preview = '개발자의 정보를 확인합니다';

	async All(chat: Chat, user: UserData, channel: ChannelData) {
		var devinfo = await this.Client.OpenLinkManager.getFromURL(DevUrl);
		await this.Karin.Feed('개발자').Profile({
			TD: { T: devinfo.LinkOwnerInfo.Nickname },
			TH: {
				THU: devinfo.LinkOwnerInfo.ProfileImageURL,
				H: 200, W: 200
			}
		}).TextFull(true).Text({
			T: '안내',
			D: '위 유저 외 SKADI의 개발자,관리자를 자칭하는 유저는 모두 사칭입니다.'
		}).Button({
			BU: {
				T: '문의하기'
			},
			L: {
				LPC: DevUrl,
				LCA: DevUrl,
				LCI: DevUrl,
				LMO: DevUrl
			}
		}).SendChat(chat);
	}
}