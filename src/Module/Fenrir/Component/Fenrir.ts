import { ChatChannel, ChatType, ChatUser, FeedChat, FeedType, OpenKickFeed } from "node-kakao";
import ChannelComponent from "../../../Core/Citius/Channel/ChannelComponent";
import FenrirRaw from "./FenrirRaw";

export default class Fenrir extends ChannelComponent<FenrirRaw>{
	private _showkick: boolean;
	public get Showkick() { return this._showkick; }
	public set Showkick(bool: boolean) { this._showkick = bool; }
	public SwitchShowkick() { return this._showkick = !this._showkick; }

	protected Initialization(): FenrirRaw {
		return {
			showkick: true
		}
    }
	protected Installation(raw: FenrirRaw) {
		this._showkick = raw.showkick;
    }
	public Raw(): FenrirRaw {
		return {
			showkick: this._showkick
		}
	}

	public async IssueKicked(channel: ChatChannel, user: ChatUser, feed?: FeedChat<OpenKickFeed>) {
		if (this.Showkick && feed?.Feed?.feedType === FeedType.OPENLINK_KICKED && !feed.Sender.isClientUser()) {
			var at = channel.getUserInfo(feed.Sender);
			await this.Karin.Feed('강퇴정보').Profile({
				TD: { T: at.Nickname },
				TH: { THU: at.ProfileImageURL, H: 200, W: 200 },
			}).TextFull(true).Text({
				T: `${at.Nickname}님이 ${feed.Feed.member.nickName}님을 내보냈습니다`
			}).SendChannel(channel);
		}
	}
}