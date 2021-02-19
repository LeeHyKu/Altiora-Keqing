import { Chat, OpenChatChannel, ReplyChat } from "node-kakao";
import ChannelData from "../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../Core/Citius/User/UserData";
import ForManagers from "../../../Core/Fortius/Command/Checkers/ForManagers";
import ReplyOnly from "../../../Core/Fortius/Command/Checkers/ReplyOnly";
import RequireManager from "../../../Core/Fortius/Command/Checkers/RequireManager";
import Command from "../../../Core/Fortius/Command/Command";

export default class FenrirSKicker extends Command {
	readonly command = '특수킥';
	readonly aliases = ['spkick'];

	readonly preview = '이미 나간 유저를 내보낼 수 있는 채팅방 관리자를 위한 명령어입니다.';
	readonly information = [
		{ info: '답장하기로 유저가 입장 혹은 퇴장한 기록의 윗채팅을 지정해주세요.' },
		{ arg: '[<숫자>]', info: '해당 기록의 바로 위 기록을 지정할 수 없는 경우, 지정할 수 있는 채팅에서 그 차이만큼의 숫자를 입력하여 유저를 지정할 수 있습니다.' }
	];
	readonly checkers = [ForManagers, RequireManager, ReplyOnly];

	async Prefix(chat: Chat, user: UserData, channel: ChannelData) {
		await this.Args(chat, ['0'], user, channel);
	}
	async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) {
		try {
			var index = parseInt(args[0]) || 0;
			var focus = (await this.Client.ChatManager.getChatListFrom(chat.Channel.Id, (<ReplyChat>chat).Reply.SourceLogId)).result[index];
			var info = await chat.Channel.getLatestUserInfoId(focus.Sender.Id);

			await this.Karin.Feed('Confirm').Profile({ TD: { T: info.Nickname }, TH: { THU: info.ProfileImageURL, H: 200, W: 200 } }).Text({ T: 'Confirm?', D: '위 유저를 킥합니다. 계속하시겠습니까?' }).SendChat(chat);
			if ((await this.Nakiri.Confirm(chat.Sender, false)).result) ((await (<OpenChatChannel>chat.Channel).kickMemberId(focus.Sender.Id)).result ? this.Karin.Confirm(`유저 ${info.Nickname}을 킥했습니다`, '킥 완료') : this.Karin.Reject(`알 수 없는 이유로 유저 ${info.Nickname}을 킥하는데 실패했습니다`, '킥 실패')).SendChannel(chat.Channel);
			else
				this.Karin.Reject('취소하였습니다', '실행 취소').SendChannel(chat.Channel);
		}
		catch (e) {
			this.Karin.Error(e).SendChannel(chat.Channel);
		}
	}
}