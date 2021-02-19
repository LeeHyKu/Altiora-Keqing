import UserData from "../../Core/Citius/User/UserData";
import KeqingBase from "../../Core/KeqingBase";
import StockAsset from "./Exchange/StockAsset";
import StockAssetCS from "./Exchange/StockAssetCS";
import StockAssetRaw from "./Exchange/StockAssetRaw";

export default class Diluc extends KeqingBase {
	private structs: StockAssetCS[] = [];
	public Attach(...structs: StockAssetCS[]) { this.structs.push(...structs); }
	private Find(name: string) { return this.structs.find(e => e.name === name); }
	public CreateByName(user: UserData, raw: StockAssetRaw<any>): StockAsset<any, any, any> { return new (this.Find(raw.struct))(this.Keqing, user, raw); }
}