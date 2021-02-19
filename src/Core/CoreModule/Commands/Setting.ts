import { Chat, ChatMention, Long } from "node-kakao";
import ChannelData from "../../Citius/Channel/ChannelData";
import UserData from "../../Citius/User/UserData";
import ForTrustManagers from "../../Fortius/Command/Checkers/ForTrustManager";
import Command from "../../Fortius/Command/Command";

export default class Setting extends Command {
	readonly command = '설정';
	readonly critical = true;

	readonly checkers = [ForTrustManagers];

	readonly preview = '채팅봇의 환경설정 명령어입니다. 채팅방의 관리자만 사용할 수 있습니다';
	readonly information = [
		{ arg: '접미사 <접미사>', info: `본 채팅봇의 접미사를 설정합니다(기본: ${this.Keqing.Prefix})\r\n접미사가 입력되지 않을 경우 기본 접미사로 설정합니다.` },
		{ arg: '경고문', info: '경고문 출력설정을 끄거나 킵니다.' },
		{ arg: '매니저', info: '매니저는 방장/부방장과 같이 채팅봇, 채널을 관리할 수 있습니다.' },
		{ arg: '매니저 목록', info: '매니저의 목록을 확인합니다' },
		{ arg: '매니저 <@유저 맨션>', info: '매니저를 임명/해임합니다' },
		{ arg: '쿨타임 <숫자>', info: '모든 명령어의 쿨타임을 설정합니다\r\n(최소 0초, 최대 30초)' },
		{ arg: '명령어 <cid>', info: 'cid를 입력하여 명령어를 활성화/비활성화합니다' },
		{ arg: '명령어 cid', info: '각 명령어별 cid 목록을 확인할 수 있습니다' },
		{ arg: '명령어 목록', info: '비활성화한 명령어 목록을 확인할 수 있습니다' },
		{ arg: '봇유저', info: '해당 채팅방의 다른 채팅봇들을 지정해주세요' },
		{ arg: '봇유저 <@유저 맨션>', info: '봇유저를 지정/해제합니다' },
		{ arg: '봇유저 목록', info: '봇유저 목록을 불러옵니다' },
	];

	async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) {
		switch (args[0]) {
			case '접미사':
				channel.Prefix = args[1] ?? '';
				await this.Karin.Confirm(`본 채팅방의 접미사를 ${channel.Prefix}로 설정했습니다`, '접미사 설정').SendChat(chat);
				break;
			case '경고문':
				var confirm = channel.Hidewarning = !channel.Hidewarning;
				await this.Karin.Confirm(`경고문 출력을 ${confirm ? '해제' : '설정'}했습니다`, `경고문 출력 ${confirm ? '해제' : '설정'}`).SendChat(chat);
				break;
			case '매니저':
				if (chat.getMentionContentList().length > 0) {
					var confirm = channel.ToggleManager(chat.getMentionContentList()[0].UserId);
					await this.Karin.Reject(`해당 유저의 매니저 권한을 ${confirm ? '추가했습니다' : '삭제했습니다'}`, `매니저 ${confirm ? '추가' : '삭제'}`).SendChat(chat);
				}
				else {
					switch (args[1]) {
						case '목록':
							var manager = channel.Managers.map(e => chat.Channel.getUserInfoId(Long.fromString(e)));
							await chat.replyText(
								new ChatMention(chat.Channel.getUserInfo(chat.Sender)), '\r\n',
								'매니저 권한을 부여받은 유저 목록입니다', '\u200b'.repeat(500), '\r\n',
								manager.map(e => e ? e.Nickname : '오류: 알 수 없는 유저').join('\r\n'), '\r\n\r\n',
								'매니저는 채팅방을 관리할 수 있는 명령어를 사용할 수 있습니다'
							);
							break;
						default:
							await this.Karin.Reject('유저를 맨션해주세요', '유저맨션필요').SendChat(chat);
							break;
					}
				}
				break;
			case '쿨타임':
				if (!isNaN(+args[1])) {
					var num = Math.min(Math.max(+args[1] * 1000, 0), 30000);
					channel.Cooltime = num;
					await this.Karin.Confirm(`채널의 쿨타임을 ${+(num / 1000).toFixed(5)}초로 설정했습니다`, '쿨타임설정완료').SendChat(chat);
				}
				else await this.Karin.Reject('숫자를 입력해주세요', '숫자입력필요').SendChat(chat);
				break;
			case '명령어':
				switch (args[1]) {
					case 'cid':
						var syncs = this.Keqing.CommandHandler.Syncs.filter(e => !e.critical);
						var commands = this.Keqing.CommandHandler.Commands.filter(e => !e.critical);
						await chat.replyText(
							new ChatMention(chat.Channel.getUserInfo(chat.Sender)), '\r\n',
							'본 채팅봇의 cid 목록입니다', '\u200b'.repeat(500), '\r\n\r\n',
							'-----SYNCS-----', '\r\n',
							syncs.map(e => e.constructor.name).join('\r\n'), '\r\n\r\n',
							'-----COMMANDS-----', '\r\n',
							commands.map(e => `${e.constructor.name} | ${e.preview || '설명없음'}`).join('\r\n'), '\r\n\r\n',
							'중요한 일부 명령어는 표시되지 않습니다'
						);
						break;
					case '목록':
						var cids = channel.BannedCommands;
						await chat.replyText(
							new ChatMention(chat.Channel.getUserInfo(chat.Sender)), '\r\n',
							'본 채팅방에서 비활성화된 cid 목록입니다', '\u200b'.repeat(500), '\r\n\r\n',
							cids.join('\r\n')
						); 
						break;
					default:
						if (!args[1]) await this.Karin.Reject('cid를 입력해주세요', 'cid입력필요').SendChat(chat);
						else {
							var confirm = channel.ToggleBanCommand(args[1]);
							await this.Karin.Confirm(`cid ${args[1]}을 밴리스트에 ${confirm ? '추가하였습니다' : '삭제하였습니다'}`, `밴리스트 ${confirm ? '추가' : '삭제'}`).SendChat(chat);
						}
						break
				}
				break;
			case '봇유저':
				if (chat.getMentionContentList().length > 0) {
					var confirm = channel.ToggleBotUser(chat.getMentionContentList()[0].UserId);
					await this.Karin.Reject(`해당 유저의 봇유저 구분을 ${confirm ? '설정했습니다' : '해제했습니다'}`, `봇유저 구분 ${confirm ? '설정' : '해제'}`).SendChat(chat);
				}
				else {
					switch (args[1]) {
						case '목록':
							var bots = channel.BotUsers.map(e => chat.Channel.getUserInfoId(Long.fromString(e)));
							await chat.replyText(
								new ChatMention(chat.Channel.getUserInfo(chat.Sender)), '\r\n',
								'봇유저로 구분한 유저 목록입니다', '\u200b'.repeat(500), '\r\n',
								bots.map(e => e ? e.Nickname : `오류: 알 수 없는 유저`).join('\r\n'), '\r\n\r\n',
								'봇유저에 대해서 본 채팅봇이 반응하지 않습니다'
							);
							break;
						default:
							await this.Karin.Reject('유저를 맨션해주세요', '유저맨션필요').SendChat(chat);
							break;
					}
				}
				break;
		}
	}
}