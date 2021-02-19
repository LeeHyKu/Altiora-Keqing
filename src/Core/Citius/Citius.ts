import { Db, MongoClient } from "mongodb";
import Keqing from "../Keqing";
import KeqingBase from "../KeqingBase";
import ChannelTable from "./Channel/ChannelTable";
import CitiusConfig from "./CitiusConfig";
import KeqingSingletonC from "./KeqingSingletonC";
import SchemaCustom from "./SchemaCustom";
import UserTable from "./User/UserTable";

export default class Citius extends KeqingBase {
	private _dbclient: MongoClient;
	private _database: Db;
	public get DBClient() { return this._dbclient }
	public get Database() { return this._database; }

	private _channel: ChannelTable;
	private _user: UserTable;
	public get Channel() { return this._channel; }
	public get User() { return this._user; }

	public GetTable<T extends SchemaCustom = any>(table: string) { return this.Database.collection<T>(this.config.Tables[table] || table); }

	private _singletons: { [name: string]: KeqingBase } = {};
	public GetSingleton<T extends KeqingBase>(struct: KeqingSingletonC<T>) {
		if (this._singletons[struct.name]) return <T>this._singletons[struct.name];
		else return <T>(this._singletons[struct.name] = new struct(this.Keqing));
	}

	constructor(keqing: Keqing, private config: CitiusConfig) {
		super(keqing);
	}

	private trigger: boolean = false;
	private _looper: NodeJS.Timeout;
	public get Looper() { return this._looper; }
	public async Ignition() {
		if (this.trigger) return;
		else {
			try {
				this._dbclient = await MongoClient.connect(this.config.DBPath);
				this._database = this.DBClient.db(this.config.DBName);

				this._channel =	new ChannelTable(this.Keqing, this.Database.collection(this.config.Tables['Channel']));
				this._user = new UserTable(this.Keqing, this.Database.collection(this.config.Tables['User']));

				this._looper = setInterval(() => { this.Channel.CheckAll(); this.User.CheckAll(); this.Qurare.Focus('Citius Checking...'); }, 300000);

				this.trigger = true;
			}
			catch (e) { this.Qurare.FatalError(e); }
		}
	}
}