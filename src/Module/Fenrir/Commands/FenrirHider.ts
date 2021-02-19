import { Chat, Long, OpenChatChannel, ReplyChat } from "node-kakao";
import ChannelData from "../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../Core/Citius/User/UserData";
import ForManagers from "../../../Core/Fortius/Command/Checkers/ForManagers";
import ReplyOnly from "../../../Core/Fortius/Command/Checkers/ReplyOnly";
import RequireManager from "../../../Core/Fortius/Command/Checkers/RequireManager";
import Command from "../../../Core/Fortius/Command/Command";

export default class FenrirHider extends Command {
	readonly command = '가리기';
	readonly aliases = ['hide'];

	readonly preview = '여러개의 채팅을 한번에 가리기 위한 채팅방 관리자용 명령어입니다.';
	readonly information = [
		{ arg: '<숫자>', info: '답장하기로 가릴 채팅목록의 가장 윗부분을 지정해주세요.' }
	];
	readonly checkers = [ForManagers, RequireManager, ReplyOnly];

	async Prefix(chat: Chat, user: UserData, channel: ChannelData) {
		await this.Args(chat, ['1'], user, channel);
	}
	async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) {
		try {
			var parsed = Math.min(parseInt(args[0]) || 1, 90);
			var chats = [
				(chat as ReplyChat).Reply.SourceLogId,
				...(await this.Client.ChatManager.getChatListFrom(chat.Channel.Id, (chat as ReplyChat).Reply.SourceLogId)).result.slice(0, parsed - 1)
			];

			await this.Nakiri.CKarin(`지정한 채팅부터 ${parsed}개 아래 채팅들을 가립니다. 계속하시겠습니까?`, false, '채팅 가리기').SendChat(chat);
			if ((await this.Nakiri.Confirm(chat.Sender, false)).result) {
				for (var c of chats) {
					await ((c instanceof Chat) ?
						(<Chat>c).hide() :
						(<OpenChatChannel>chat.Channel).hideChatId(<Long>c))
				}
				this.Karin.Confirm('가리기 완료되었습니다').SendChannel(chat.Channel);
			}
			else this.Karin.Reject('취소되었습니다', '실행취소').SendChannel(chat.Channel);
		}
		catch (e) {
			this.Karin.Error(e).SendChannel(chat.Channel);
		}
	}
}