import { Chat } from "node-kakao";
import ChannelData from "../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../Core/Citius/User/UserData";
import Command from "../../../Core/Fortius/Command/Command";
import BattleMember from "../Battle/BattleMember";
import BattleTemp from "../Battle/BattleTemp";

export default class OdinAttackCommand extends Command {
	readonly command = '공격';
	readonly aliases = ['\u200b:공격'];

	async Prefix(chat: Chat, user: UserData, channel: ChannelData) { await (await user.GetTempU(BattleTemp)?.DoAttack?.())?.SendChat?.(chat); }
	async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) { await (await user.GetTempU(BattleTemp)?.DoAttack?.(chat.getMentionContentList()[0]?.UserId?.toString?.() || args.join(' ')))?.SendChat?.(chat); }
}