import { ReplyChat } from "node-kakao";
import ForManagers from "../../Fortius/Command/Checkers/ForManagers";
import ReplyOnly from "../../Fortius/Command/Checkers/ReplyOnly";
import Command from "../../Fortius/Command/Command";

export default class Delete extends Command {
	readonly command = '삭제';
	readonly aliases = ['d'];
	readonly checkers = [ForManagers, ReplyOnly];

	readonly preview = '본 채팅봇이 부적절한 문장을 출력한 경우 해당 채팅을 삭제할 수 있는 관리자용 명령어입니다.\r\n삭제에 성공한 경우 답장을 하지 않습니다.';

	async All(chat: ReplyChat) {
		var focus = chat.Reply;
		if (focus.SourceUserId.toString() !== this.Client.ClientUser.Id.toString()) await this.Karin.Reject('본 채팅봇의 채팅만 삭제할 수 있습니다', '삭제할 수 없는 채팅').SendChat(chat);
		else {
			var result = await this.Client.ChatManager.deleteChat(chat.Channel.Id, focus.SourceLogId);
			if (!result.result) await this.Karin.Reject('알 수 없는 이유로 해당 채팅을 삭제하는데 실패했습니다', '삭제불가').SendChat(chat);
		}
	}
}