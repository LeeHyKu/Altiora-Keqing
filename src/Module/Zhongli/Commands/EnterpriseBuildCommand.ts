import { Chat } from "node-kakao";
import ChannelData from "../../../Core/Citius/Channel/ChannelData";
import UserData from "../../../Core/Citius/User/UserData";
import Command from "../../../Core/Fortius/Command/Command";
import EnterpriseBuilder from "../Enterprise/EnterpriseBuilder";

export default class EnterpriseBuildCommand extends Command {
	readonly command = '회사생성';

	readonly preview = '회사생성 명령어(빌더 명령어)';
	readonly information = [
		{ arg: '이름 <이름>', info: '회사의 이름을 설정합니다' },
		{ arg: '주명 <주명>', info: '회사의 주식명을 설정합니다. 회사를 지정할때 주로 사용됩니다.' },
		{ arg: '설명 <설명>', info: '회사의 설명을 설정합니다' },
		{ arg: '완성', info: '회사를 설립합니다' },
		{ arg: '상태', info: '생성중인 회사의 상태를 확인합니다' },
		{ arg: '취소', info: '회사 생성을 취소합니다' }
	];

	async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) {
		try {
			switch (args[0]) {
				case '이름':
					user.GetTemp(EnterpriseBuilder).Name(args.slice(1, args.length).join(' '));
					await this.Karin.Confirm('이름을 설정했습니다', '이름설정').SendChat(chat);
					break;
				case '주명':
					user.GetTemp(EnterpriseBuilder).Stname(args.slice(1, args.length).join(' '));
					await this.Karin.Confirm('주식명을 설정했습니다', '주명설정완료').SendChat(chat);
					break;
				case '설명':
					user.GetTemp(EnterpriseBuilder).Description(args.slice(1, args.length).join(' '));
					await this.Karin.Confirm('설명을 수정했습니다', '설명수정완료').SendChat(chat);
					break;
				case '완성':
					if (!user.HasTemp(EnterpriseBuilder)) await this.Karin.Reject('생성중인 회사가 없습니다', '회사생성중 아님').SendChat(chat);
					else {
						await this.Nakiri.CKarin(`회사를 창설하기 위해선 3백만원이 필요합니다. 계속하시곘습니까?`, false, '회사생성').SendChat(chat);
						var confirm = await this.Nakiri.Confirm(chat.Sender, false, 30000);
						if (!confirm.result) await this.Karin.Reject('생성을 취소하였습니다', '취소').SendChat(chat)
						else {
							await user.GetTemp(EnterpriseBuilder).Build();
							await this.Karin.Confirm('회사를 생성했습니다', '회사생성완료').SendChat(chat);
						}
					}
					break;
				case '상태':
					if (!user.HasTemp(EnterpriseBuilder)) await this.Karin.Reject('생성중인 회사가 없습니다', '회사생성중 아님').SendChat(chat);
					else await user.GetTemp(EnterpriseBuilder).Status().SendChat(chat);
					break;
				case '취소':
					if (!user.HasTemp(EnterpriseBuilder)) await this.Karin.Reject('생성중인 회사가 없습니다', '회사생성중 아님').SendChat(chat);
					else {
						user.GetTemp(EnterpriseBuilder).Delete();
						await this.Karin.Confirm('회사빌더를 삭제했습니다', '회사생성취소').SendChat(chat);
					}
					break;
			}
		}
		catch (e) {
			await this.Karin.Error(e).SendChat(chat);
		}
	}
}