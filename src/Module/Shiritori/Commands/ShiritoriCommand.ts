import { Chat } from "node-kakao";
import ChannelData from "../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../Core/Citius/User/UserData";
import Command from "../../../Core/Fortius/Command/Command";
import ShiritoriGame from "../Game/ShiritoriGame";

export default class ShiritoriCommand extends Command {
	readonly command = '끝말잇기';
	readonly aliases = ['시리토리', '시토'];
	readonly term = false;

	readonly preview = '끝말잇기 명령어';
	readonly information = [
		{ arg: '생성', info: '방을 생성합니다.\r\n5분동안 시작되지 않을 경우 자동으로 소멸됩니다' },
		{ arg: '입장', info: '방에 입장합니다' },
		{ arg: '퇴장', info: '방에서 퇴장합니다' },
		{ arg: '시작', info: '끝말잇기를 시작합니다\r\n2명 이상이 입장해있어야 합니다' },
		{ arg: '목록', info: '방에 입장해있는 인원 목록을 불러옵니다' },
		{ arg: '상태', info: '방의 상태를 확인합니다' },
		{ arg: '한방단어', info: '(호스트 전용)한방단어를 허용하거나 금지합니다\r\n(기본: 금지)' },
		{ arg: '라이프 <숫자>', info: '(호스트 전용)유저의 기본 라이프를 설정합니다\r\n(기본: 2, 최소 1, 최대 5)' },
		{ arg: '시간 <숫자>', info: '(호스트 전용)제한시간을 설정합니다\r\n(기본: 15초, 최소 10, 최대 30)' }
	]

	async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) {
		switch (args[0]) {
			case '생성':
				if (channel.HasTempU(ShiritoriGame)) await this.Karin.Reject('본 채널에 이미 생성되어있는 게임이 있습니다', '이미게임 생성됨').SendChat(chat);
				else {
					var game = new ShiritoriGame(this.Keqing, channel);
					channel.AttachTempU(game);
					game.AddPlayer(user);
					await this.Karin.Confirm('게임이 생성되었습니다', '게임 생성됨').SendChat(chat);
				}
				break;
			default: {
				if (!channel.HasTempU(ShiritoriGame)) await this.Karin.Reject('생성된 게임이 없습니다', '게임 생성되지 않음').SendChat(chat);
				else {
					var game = channel.GetTempU(ShiritoriGame);
					switch (args[0]) {
						case '입장':
							if (game.AddPlayer(user)) await this.Karin.Confirm('게임에 입장하였습니다', '입장완료').SendChat(chat);
							else await this.Karin.Reject('게임에 입장하는데 실패했습니다', '입장실패').SendChat(chat);
							break;
						case '퇴장':
							if (await game.ExitPlayer(user)) await this.Karin.Confirm('게임에서 퇴장했습니다', '퇴장완료').SendChat(chat);
							else await this.Karin.Reject('게임에서 퇴장하는데 실패했습니다', '퇴장실패').SendChat(chat);
							break;
						case '목록':
							break;
						case '상태':
							await game.Feed().SendChat(chat);
							break;
						case '시작':
							if (!game.isHost(user.ID)) await this.Karin.Reject('게임의 호스트가 아닙니다', '관리불가').SendChat(chat);
							else if (game.GamerNumber < 2) await this.Karin.Reject('2명 이상이 참가해야합니다', '시작불가').SendChat(chat);
							else await game.ShowAndStartWait();
							break;
						case '한방단어':
							if (!game.isHost(user.ID)) await this.Karin.Reject('게임의 호스트가 아닙니다', '관리불가').SendChat(chat);
							else {
								var toggle = game.ToggleDecisive();
								await this.Karin.Confirm(`한방단어를 ${toggle ? '허용' : '비허용'}했습니다`, `한방단어 ${toggle ? '허용' : '비허용'}`)
							}
							break;
						case '라이프':
							if (!game.isHost(user.ID)) await this.Karin.Reject('게임의 호스트가 아닙니다', '관리불가').SendChat(chat);
							else {
								var life = Math.max(Math.min(+args[1] || 1, 5), 1);
								game.LifeCount = life;
								await this.Karin.Confirm(`기본 라이프를 ${life}로 설정했습니다`, '기본 라이프 설정').SendChat(chat);
							}
							break;
						case '시간':
							if (!game.isHost(user.ID)) await this.Karin.Reject('게임의 호스트가 아닙니다', '관리불가').SendChat(chat);
							else {
								var time = Math.max(Math.min(+args[1] || 10, 30), 10);
								game.TimeLimit = time;
								await this.Karin.Confirm(`기본 제한시간을 ${time}로 설정했습니다`, '기본 제한시간 설정').SendChat(chat);
							}
							break;
					}
				}
			}
				break;
		}
	}
}