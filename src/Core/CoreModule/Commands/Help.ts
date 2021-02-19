import { Chat, CustomType } from "node-kakao";
import ChannelData from "../../Citius/Channel/ChannelData";
import UserData from "../../Citius/User/UserData";
import Command from "../../Fortius/Command/Command";
import Feed from "../../Karin/Contents/Feed/Feed";
import List from "../../Karin/Contents/List/List";

export default class Help extends Command {
	readonly command = '명령어';
	readonly aliases = ['h', 'help', '도움말'];
	readonly critical = true;

	readonly preview = '명령어를 확인합니다.';
	readonly information = [
		{ info: '명령어 목록을 확인합니다' },
		{ args: '[<명령어>]', info: '해당 명령어의 자세한 정보를 확인합니다' }
	];

	async Prefix(chat: Chat, user: UserData, channel: ChannelData) {
		var commandall = this.Keqing.CommandHandler.Commands;
		var commands: Command[] = [];
		for (let command of commandall) if (!(await command.CheckHelper(chat, user, channel))) commands.push(command);

		if (commands.length < 1) await this.Karin.Reject('데이터가 부족하여 자료를 표시할 수 없습니다', '데이터 부족').SendChat(chat);
		else {
			var i, j;
			var carousel = this.Karin.Carousel<List>(CustomType.LIST, '명령어목록');

			var first = this.Karin.List('').Head({ TD: { T: '명령어목록 p.1' } });
			first.Item({ TD: { T: `'${channel.Prefix}h <명령어>'로 더 자세한 정보를 확인 할 수 있습니다.`, D: '안내사항' } });
			for (i = 0; i < 4 && i < commands.length; i++) {
				let command = commands[i];
				first.Item({ TD: { T: command.GetCommand(channel.Prefix), D: command.preview || '설명없음' } });
			}
			carousel.add(first);

			if (commands.length > 4) {
				for (i = 0; i < (commands.length - 4) / 5; i++) {
					var list = this.Karin.List('').Head({ TD: { T: `명령어목록 p.${i+2}` } });
					for (j = 0; j < 5 && ((i * 5) + j + 4) < commands.length; j++) {
						var item = commands[(i * 5) + j + 4];
						list.Item({ TD: { T: item.GetCommand(channel.Prefix), D: item.preview || '설명없음' } });
					}
					carousel.add(list);
				}
			}

			await carousel.SendChat(chat);
		}
	}

	async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) {
		var commandall = this.Keqing.CommandHandler.Commands;
		var commands: Command[] = [];
		for (let command of commandall) if (!(await command.CheckHelper(chat, user, channel))) commands.push(command);

		var command = commands.find(e => e.CheckCommand(args[0], ''));
		if (!command) await this.Karin.Reject('명령어를 찾을 수 없습니다', '명령어 알 수 없음').SendChat(chat);
		else {
			var carousel = this.Karin.Carousel<Feed>(CustomType.FEED, '명령어정보');

			if (command.preview) carousel.add(this.Karin.Feed('').Text({ T: '명령어 설명', D: command.previewIndex || command.preview }).TextFull(true));
			if (command.information) {
				var infop = command.information.find(e => !e.arg);
				var infos = command.information.filter(e => e.arg);
				var comp = command.GetCommand(channel.Prefix);
				if (infop) carousel.add(this.Karin.Feed('').Text({ T: comp, D: infop.info }).TextFull(true));
				if (infos.length > 0) for (var info of infos) carousel.add(this.Karin.Feed('').Text({ T: `${comp} ${info.arg}`, D: info.info }).TextFull(true));
			}

			if (carousel.CIL.length < 1) await this.Karin.Reject('명령어를 찾았지만, 명령어의 설명이 입력되어 있지 않습니다', '명령어 설명 없음').SendChat(chat);
			else await carousel.SendChat(chat);
		}
	}
}