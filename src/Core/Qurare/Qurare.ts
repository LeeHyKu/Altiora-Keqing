import KeqingBase from "../KeqingBase";
import Gravity from "./Gravity";
import QurareMember from "./QurareMember";
import * as chalk from "chalk"; 
import ContentBuilder from "../Karin/Builders/ContentBuilder";
import { AttachmentTemplate, ChannelType } from "node-kakao";

export default class Qurare extends KeqingBase {
	private logs: QurareMember[] = [];
	private Print(log: QurareMember) {
		this.logs.push(log);
		console.log(`${Gravity.Color[log.level](`[${Gravity.Kr[log.level]}]`)}${chalk.gray(log.issued.toLocaleTimeString())} ${log.content}`);
		this.Lamy.Broadcast('logs', { gravity: log.level, logstr: log.content, time: log.issued.toISOString() });
		//this.Altius.Lamy?.Io?.emit?.('log', <LamyBroadcast['log']>{ level: log.level, issued: log.issued.toISOString(), content: log.content });
	}

	public QurareMember(level: Gravity, content: any) {
		if (content instanceof String) this.Print({ level: level, issued: new Date(), content: <string>content });
		else this.Print({ level: level, issued: new Date(), content: String(content), origin: content });
	}

	public Minor(content: any) { this.QurareMember(Gravity.MINOR, content); }
	public Normal(content: any) { this.QurareMember(Gravity.NORMAL, content); }
	public Focus(content: any) { this.QurareMember(Gravity.FOCUS, content); }

	public Caution(content: any) { this.QurareMember(Gravity.CAUTION, content); }
	public Warning(content: any) { this.QurareMember(Gravity.WARNING, content); }
	public Error(err: Error) { this.QurareMember(Gravity.ERROR, `${chalk.bgRedBright(err.name)}:${chalk.redBright(err.message)}\n${chalk.redBright(err.stack.split('\n').slice(2).join('\n'))}`); }

	public Important(content: any) { this.QurareMember(Gravity.IMPORTANT, content); }
	public Fatal(content: any) { this.QurareMember(Gravity.FATAL, content); }
	public FatalError(err: Error) { this.QurareMember(Gravity.FATAL, `${chalk.bgRed(err.name)}:${chalk.red(err.message)}\n${chalk.redBright(err.stack.split('\n').slice(2).join('\n'))}`); }

	public async Save() { /*TODO:save to Citius*/ }

	public async NoticToOpenChannels(karin: ContentBuilder<any>): Promise<number> {
		return new Promise<number>(async s => {
			var attachment = karin.Complate();
			var channels = this.Client.ChannelManager.getChannelList().filter(e => e.Type === ChannelType.OPENCHAT_GROUP);
			var cindex = 0;
			var action = async () => {
				var channel = channels[cindex];
				this.Minor(`send notice to ${channel.Name}`);
				await channel.sendTemplate(new AttachmentTemplate(attachment));
				cindex++;
				if (cindex < channels.length) setTimeout(action, 200);
				else s(cindex);
			};
			setTimeout(action, 200);
		});
	}
}