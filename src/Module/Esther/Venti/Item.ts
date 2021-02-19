import { CryptoManager } from "node-kakao";
import UserData from "../../../Core/Citius/User/UserData";
import Keqing from "../../../Core/Keqing";
import KeqingBase from "../../../Core/KeqingBase";
import ItemCS from "./ItemCS";
import ItemI from "./ItemI";
import ItemRaw from "./ItemRaw";
import ItemRawM from "./ItemRawM";
import Rarity from "./Rarity";
import * as crypto from "crypto";

export default abstract class Item<T extends ItemRaw> extends KeqingBase {
	constructor(keqing: Keqing, private _user: UserData, raw: ItemRawM<T>) {
		super(keqing);
		this.Initalize(raw);
		this.Installation(raw);
	}

	protected get User() { return this._user; }
	protected abstract Installation(raw: T);
	protected abstract Export(): T;
	public Raw(): ItemRawM<T> { if (this.Destroyed) return null; else return Object.assign(this.Export(), { uid: this._uid, name: this._name, description: this._desc, rarity: this._rare }); }
	public RawI(): ItemI<T> { if (this.Destroyed) return null; else return { struct: this.constructor.name, item: this.Raw() }; }
	public Clone() { return new (this.Structor())(this.Keqing, this._user, Object.assign(this.Raw(), { uid: '' })); }
	public Give(user: UserData) { return new (this.Structor())(this.Keqing, user, Object.assign(this.Raw(), { uid: '' })); }
	protected abstract Structor(): ItemCS;
	protected Initalize(raw: ItemRawM<T>) {
		this._uid = raw.uid || this.GenerateUid(5);
		this._name = raw.name;
		this._desc = raw.description;
		this._rare = raw.rarity;
	}
	private GenerateUid(length: number) {
		var result = '';
		var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	private _uid: string;
	private _name: string;
	private _desc?: string;
	private _rare: Rarity;
	public get Uid() { return this._uid; }
	public get Name() { return this._name; }
	public get Description() { return this._desc || '설명없음'; }
	public get Rareity() { return this._rare; }

	protected isDestroyed?: boolean;
	public get Destroyed() { return !!this.isDestroyed; }

	public get StructId() { return this.constructor.name; }

	protected getName(): string { return this.Name; }
	protected getTitle(): string { return `[${Rarity.rarityKo[this.Rareity]}] ${this.getName()}\r\n${this.StructId}(uid: ${this.Uid})`; }
	protected getInfo(): string { return this.Description || '설명없음'; }
	public Feed() { return this.Karin.Feed('아이템').TextFull(true).Text({ T: this.getTitle(), D: this.getInfo() }); }

	protected abstract HashOpt(): string;
	public Hash(): string { return crypto.createHash('sha256').update(`${this.StructId}:${this.Name}:${this.Rareity}:${this.HashOpt()}`).digest('base64'); }
}