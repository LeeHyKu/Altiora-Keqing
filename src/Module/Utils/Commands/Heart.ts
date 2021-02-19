import { Chat, LinkReactionType, OpenChatUserInfo } from "node-kakao";
import UserData from "../../../Core/Citius/User/UserData";
import OpenProfileOnly from "../../../Core/Fortius/Command/Checkers/OpenProfileOnly";
import Command from "../../../Core/Fortius/Command/Command";

export default class Heart extends Command {
	readonly command = '하트';

	readonly preview = '해당 유저에게 하트를 줍니다';
	readonly previewIndex = '해당 유저에게 하트를 줍니다\r\n주의: 오픈프로필 전용';
	readonly checkers = [OpenProfileOnly];

	async All(chat: Chat, user: UserData) {
		var linkid = (await (<OpenChatUserInfo>chat.Channel.getUserInfo(chat.Sender)).getOpenLink()).LinkId;
		if ((await this.Client.OpenLinkManager.requestReactionInfo(linkid))?.result?.reactionType === LinkReactionType.NORMAL) {
			await this.Client.OpenLinkManager.setLinkReacted(linkid, LinkReactionType.NONE);
			await this.Karin.Reject('해당 유저의 하트를 회수했습니다', '리액션 취소').Profile(await user.GetProfile()).Social({ LK: (await this.Client.OpenLinkManager.requestReactionInfo(linkid))?.result?.reactionCount }).SendChat(chat);
		}
		else {
			await this.Client.OpenLinkManager.setLinkReacted(linkid, LinkReactionType.NORMAL);
			await this.Karin.Confirm('해당 유저에게 하트를 지급했습니다', '하트리액션').Profile(await user.GetProfile()).Social({ LK: (await this.Client.OpenLinkManager.requestReactionInfo(linkid))?.result?.reactionCount }).SendChat(chat);
		}
	}
}