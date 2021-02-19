import { Chat, OpenChatChannel, OpenMemberType } from "node-kakao";
import ChatEvent from "../eventhandlers/ChatEvent";
import Command from "./Command";
import CommandCS from "./CommandCS";
import SyncChat from "./SyncChat";
import SyncChatCS from "./SyncChatCS";

export default class CommandHandler extends ChatEvent {
	private _syncs: SyncChat[] = [];
	private _commands: Command[] = [];
	public AttachSync(...syncs: SyncChatCS[]) { this._syncs.push(...syncs.map(e => new e(this.Keqing))); }
	public AttachComm(...commands: CommandCS[]) { this._commands.push(...commands.map(e => new e(this.Keqing))); }

	public get Syncs() { return this._syncs; }
	public get Commands() { return this._commands; }

	public async Execute(chat: Chat) {
		if (chat.Sender.isClientUser() || (chat.Channel as OpenChatChannel).getMemberType?.(chat.Sender) == OpenMemberType.BOT) return;
		try {
			var userdata = await this.Citius.User.Find(chat.Sender.Id, chat.Channel);
			var channeldata = await this.Citius.Channel.Find(chat.Channel);
			var pid = this.GenerateUid(7);
			userdata.Use(pid);
			channeldata.Use(pid);

			if (channeldata.isBotUser(chat.Sender.Id)) return;

			for (var sync of this._syncs) if (!(await sync.Check(chat, userdata, channeldata))) {
				try {
					await sync.Execute(chat, userdata, channeldata);
					if (sync.cooltime || channeldata.Cooltime) userdata.SetCool(`command:${chat.Channel.Id.toString()}:${sync.constructor.name}`, sync.cooltime || channeldata.Cooltime);
				}
				catch (e) {
					this.Qurare.Error(e);
				}
			}

			var command = this._commands
				.filter(e => e.CheckCommand(chat.Text, channeldata.Prefix))
				.sort((a, b) => a.Change(chat.Text, channeldata.Prefix).join(' ').length - b.Change(chat.Text, channeldata.Prefix).join(' ').length)[0];
			if (command) {
				try {
					var check = await command.Check(chat, userdata, channeldata);
					if (!check) {
						var args = command.Change(chat.Text, channeldata.Prefix);
						await command.All(chat, userdata, channeldata);
						if (args.length < 1) await command.Prefix(chat, userdata, channeldata);
						else await command.Args(chat, args, userdata, channeldata);

						if (command.cooltime || channeldata.Cooltime) userdata.SetCool(`command:${chat.Channel.Id.toString()}:${command.constructor.name}`, command.cooltime || channeldata.Cooltime);
					}
					else if (command.showRejection && !channeldata.Hidewarning) await check.OnRejection(command.constructor.name, chat, userdata, channeldata, command);
				}
				catch (e) {
					this.Qurare.Error(e);
					await this.Karin.Error(e).SendChat(chat);
				}
				finally {
					this.Qurare.Normal(`user ${chat.Channel.getUserInfo(chat.Sender).Nickname} issued command ${command.constructor.name} at ${chat.Channel.getDisplayName()} chat: ${chat.Text}`);
				}
			}
		}
		catch (e) {
			this.Qurare.Error(e);
		}
		finally {
			userdata?.Used?.(pid);
			channeldata?.Used?.(pid);
			chat.markChatRead();
		}
	}

	private GenerateUid(length: number) {
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}
}