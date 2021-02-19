import { Chat } from "node-kakao";
import ChannelData from "../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../Core/Citius/User/UserData";
import Command from "../../../Core/Fortius/Command/Command";
import GomokuPlayer from "../Game/GomokuPlayer";

export default class GomokuInput extends Command {
	readonly command = '\u200b:';
	readonly showRejection = false;

	async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) {
		(await user.GetTempU(GomokuPlayer)?.Input?.(args[0]))?.SendChat?.(chat);
	}
}