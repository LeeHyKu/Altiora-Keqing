import { Chat } from "node-kakao";
import ChannelData from "../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../Core/Citius/User/UserData";
import ForManagers from "../../../Core/Fortius/Command/Checkers/ForManagers";
import Command from "../../../Core/Fortius/Command/Command";
import Fenrir from "../Component/Fenrir";

export default class FenrirCommand extends Command {
	readonly command = '펜리르';
	readonly checkers = [
		ForManagers
	];

	readonly preview = '관리기능을 설정합니다';
	readonly information = [
		{ arg: '킥알림', info: '유저가 내보내졌을때 누가 내보냈는지 알려주는 기능을 키거나 끕니다' }
	];

	async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) {
		switch (args[0]) {
			case '킥알림':
				var confirm = channel.GetComponent(Fenrir).SwitchShowkick();
				await this.Karin.Confirm(`킥알림을 ${confirm ? '활성화' : '비활성화'} 했습니다`, `킥알림 ${confirm ? '활성화' : '비활성화'}`).SendChat(chat);
				break;
		}
	}
}