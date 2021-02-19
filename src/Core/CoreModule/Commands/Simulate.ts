import { Chat } from "node-kakao";
import ChannelData from "../../Citius/Channel/ChannelData";
import UserData from "../../Citius/User/UserData";
import WhiteTags from "../../Fortius/Command/Checkers/WhiteTags";
import Command from "../../Fortius/Command/Command";

export default class Simulate extends Command {
	readonly command = '실행';
	readonly aliases = ['>'];
	readonly checkers = [new WhiteTags(this.Keqing, 'DEV')];
	readonly critical = true;

	public readonly preview = '개발자 디버그용 명령어';

	async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) {
		try {
			var result = (new Function('chat', 'keqing', 'user', 'channel', args.join(' ')))(chat, this.Keqing, user, channel);
			if (result) await this.Karin.Confirm(String(result)).SendChat(chat);
		}
		catch (e) {
			await this.Karin.Error(e).SendChat(chat);
			this.Qurare.Error(e);
		}
	}
}