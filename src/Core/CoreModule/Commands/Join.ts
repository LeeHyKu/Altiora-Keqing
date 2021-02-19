import { Chat, Long, OpenLinkType, OpenProfileType } from "node-kakao";
import ChannelData from "../../Citius/Channel/ChannelData";
import UserData from "../../Citius/User/UserData";
import WhiteTags from "../../Fortius/Command/Checkers/WhiteTags";
import Command from "../../Fortius/Command/Command";

const SkadiProfile = new Long(119459284, 0);

export default class Join extends Command {
	readonly command = 'goto';
	readonly checkers = [new WhiteTags(this.Keqing, 'DEV')];

	async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) {
		var link = await this.Client.OpenLinkManager.getFromURL(args[0]);
		if (!link) await this.Karin.Reject('링크를 확인해주세요', '알 수 없는 링크').SendChat(chat);
		else if (link.LinkType !== OpenLinkType.CHANNEL) await this.Karin.Reject('오픈채널만 들어갈 수 있습니다', '올바르지 않은 링크').SendChat(chat);
		else {
			var res = await this.Client.ChannelManager.joinOpenChannel(
				link.LinkId,
				{
					type: OpenProfileType.OPEN_PROFILE, profileLinkId: SkadiProfile
				},
				args[1] || ''
			);
			if (!res.result) await this.Karin.Reject(`채널에 입장하는데 실패했습니다\r\n(코드 ${res.status})`, '입장실패').SendChat(chat);
			else {
				this.Qurare.Focus(`join channel ${res.result.getDisplayName()}`);
				await this.Karin.Confirm(`채널 ${res.result.getDisplayName()}에 입장하는데 성공했습니다`, '입장완료').SendChat(chat);
			}
		}
	}
}