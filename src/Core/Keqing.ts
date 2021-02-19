import { TalkClient } from "node-kakao";
import Citius from "./Citius/Citius";
import CoreModule from "./CoreModule/CoreModule";
import CommandHandler from "./Fortius/Command/CommandHandler";
import ChatHandler from "./Fortius/eventhandlers/ChatHandler";
import Karin from "./Karin/Karin";
import KeqingAttachment from "./KeqingAttachment";
import KeqingConfig from "./KeqingConfig";
import Lamy from "./Lamy/Lamy";
import Nakiri from "./Nakiri/Nakiri";
import Qurare from "./Qurare/Qurare";

export default class Keqing {
	private ignitioned: boolean = false;
	public get Ignitioned() { return this.ignitioned; }

	private _client: TalkClient;
	private _citius: Citius;
	private _karin: Karin;
	private _nakiri: Nakiri;
	private _qurare: Qurare;
	private _lamy: Lamy;
	public get Client() { return this._client; }
	public get Citius() { return this._citius; }
	public get Karin() { return this._karin; }
	public get Nakiri() { return this._nakiri; }
	public get Qurare() { return this._qurare; }
	public get Lamy() { return this._lamy; }
	public get Prefix() { return this._config.Prefix; }

	private _chathandler: ChatHandler;
	public get ChatHandler() { return this._chathandler; }

	private _commandhandler: CommandHandler;
	public get CommandHandler() { return this._commandhandler; }

	private actionsAfterIgnition: ((keqing: Keqing) => Promise<any>)[] = [];
	public AttachModule(...attachments: KeqingAttachment[]) {
		for (var attach of attachments) {
			if (attach.syncchat) this.CommandHandler.AttachSync(...attach.syncchat);
			if (attach.command) this.CommandHandler.AttachComm(...attach.command);
			if (attach.chatEvent) this.ChatHandler.AttachRaw(...attach.chatEvent);
			if (attach.lamies) this.Lamy.Attach(...attach.lamies.map(e => new e(this)));
			if (attach.afterIgnition) this.actionsAfterIgnition.push(attach.afterIgnition);
			if (attach.splashaction) this.splashactions.push(attach.splashaction);
		}
	}

	constructor(private _config: KeqingConfig) {
		this._client = new TalkClient(_config.Keqing.AccessFrom, _config.Keqing.UUID);
		this._citius = new Citius(this, _config.Citius);
		this._karin = new Karin(this, _config.Karin);
		this._nakiri = new Nakiri(this, _config.NakiriTime);
		this._qurare = new Qurare(this);
		this._lamy = new Lamy(this);

		this._chathandler = new ChatHandler(this);

		this._commandhandler = new CommandHandler(this);
		this.AttachModule(CoreModule);

		this.ChatHandler.Attach(this.CommandHandler);
	}

	public async Ignition() {
		try {
			this.Qurare.Important('Ignition Sequence Starts');

			['SIGINT', 'SIGHUP', 'SIGBREAK', 'SIGBUS']
				.forEach(e => process.on(e, async () => this.Splash(e, 0)));
			process.on('uncaughtException', async (error) => { this.Qurare.FatalError(error); this.Splash('uncaughtException', 1); });

			await this.Citius.Ignition();

			await this.Lamy.Ignition();

			await this.Client.login(this._config.Keqing.ID, this._config.Keqing.Password);

			for (var action of this.actionsAfterIgnition) await action(this);

			this.ignitioned = true;

			this.Qurare.Important('Ignition Sequence complate');
		}
		catch (e) {
			this.Qurare.FatalError(e);
		}
	}

	private splashactions: ((keqing: Keqing) => Promise<any>)[] = [];
	public async Splash(event: string, exit: number = 0) {
		this.Qurare.Important(`shutdown event emmited : ${event}`);

		if (this.ignitioned) {
			this.Client.logout();

			for (var action of this.splashactions) await action(this);

			await this.Citius.User.ForceSaveAll();
			await this.Citius.Channel.ForceSaveAll();
		}

		this.Qurare.Important(`SPLASH DOWN!`);
		process.exit(exit);
	}
}