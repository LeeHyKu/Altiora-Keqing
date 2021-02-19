import { Chat } from "node-kakao";
import ChannelData from "../../Citius/Channel/ChannelData";
import UserData from "../../Citius/User/UserData";
import WhiteTags from "../../Fortius/Command/Checkers/WhiteTags";
import Command from "../../Fortius/Command/Command";

export default class Notice extends Command {
	readonly command = '공지';
	readonly checkers = [new WhiteTags(this.Keqing, 'DEV')];

	async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) {
		var karin = this.Karin.Feed('채팅봇 공지사항').Profile(await user.GetProfile()).TextFull(true).Text({
			T: '공지',
			D: args.join(' ')
		});
		var index = await this.Qurare.NoticToOpenChannels(karin);
		await this.Karin.Confirm(`${index}개의 채널에 공지를 전송하는데 성공했습니다`, '공지전송완료').SendChat(chat);
	}
}