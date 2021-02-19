import { Chat } from "node-kakao";
import ChannelData from "../../Citius/Channel/ChannelData";
import UserData from "../../Citius/User/UserData";
import Checkable from "./Checkable";
import Description from "./Description";

const IgnorePrefix = '\u200b';

export default abstract class Command extends Checkable {
	protected readonly command: string = this.constructor.name;
	protected readonly aliases?: string[];
	public readonly showRejection?: boolean = true;

	public readonly preview?: string;
	public readonly previewIndex?: string;
	public readonly information?: Description[];

	private _commands: string[];
	public get Commands() {
		if (!this._commands) this._commands = (this.aliases ? [this.command, ...this.aliases] : [this.command]).sort((a, b) => b.length - a.length);
		return this._commands;
	}
	public GetCommand(prefix: string) { return this.command.includes('\u200b') ? this.command.replace('\u200b', '') : `${prefix}${this.command}` }

	public Change(text: string, prefix: string): string[] {
		for (var str of this.Commands) {
			var st = str.includes(IgnorePrefix) ? str.replace(IgnorePrefix, '') : `${prefix}${str}`;
			if (text.toLowerCase().startsWith(st.toLowerCase())) {
				var res = text.substr(st.length);
				while (res.startsWith(' ')) res = res.substr(1);
				return res ? res.split(' ') : [];
			}
		}
		return null;
	}
	public CheckCommand(text: string, prefix: string) { return this.Change(text, prefix) !== null; }

	public async All(chat: Chat, user: UserData, channel: ChannelData) { }
	public async Prefix(chat: Chat, user: UserData, channel: ChannelData) { }
	public async Args(chat: Chat, args: string[], user: UserData, channel: ChannelData) { }
}