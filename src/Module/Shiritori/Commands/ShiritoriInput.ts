import { Chat } from "node-kakao";
import ChannelData from "../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../Core/Citius/User/UserData";
import Command from "../../../Core/Fortius/Command/Command";
import ShiritoriGamer from "../Game/ShiritoriGamer";

export default class ShiritoriInput extends Command {
	readonly command = '\u200b;';
	readonly term = false;
	readonly showRejection = false;

	readonly preview = '끝말잇기 입력용 명령어';

	async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) {
		if (user.HasTempU(ShiritoriGamer)) {
			await (await user.GetTempU(ShiritoriGamer).Action(args.join(' '))).SendChat(chat);
		}
	}
}