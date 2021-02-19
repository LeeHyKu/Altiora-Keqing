import * as pack from "../../../../package.json";

import { Chat, CustomType, OpenChatChannel } from "node-kakao";
import ChannelData from "../../Citius/Channel/ChannelData";
import UserData from "../../Citius/User/UserData";
import Command from "../../Fortius/Command/Command";
import Feed from "../../Karin/Contents/Feed/Feed";

export default class Info extends Command {
	readonly command = '정보';
	readonly critical = true;

	readonly preview = '채팅봇의 상태를 확인합니다.';

	async All(chat: Chat, user: UserData, channel: ChannelData) {
		var openchats = this.Client.ChannelManager.getChannelList().filter(e => e.Type === 'OM');

		await this.Karin.Carousel<Feed>(CustomType.FEED, '정보').add(
			this.Karin.Feed('1')
				.Text({
					T: 'We are Legend\r\nCitius, Altius, Fortius',
					D: `v.${pack.version}\r\nNode ${process.version} ${process.platform}\r\nUptime: ${Math.floor(process.uptime())}초\r\n`
				})
				.TextFull(true),
			this.Karin.FeedS('2')
				.Text({
					T: '통계',
					D: `채팅방: ${openchats.length}개 | 부방: ${openchats.filter(e => (<OpenChatChannel>e).canManageChannel(this.Client.ClientUser)).length}개\r\n집계유저수: ${openchats.map(e => e.UserCount).reduce((p, n) => p + n)}명`
				})
				.TextFull(true)
		).SendChat(chat);
	}
}
