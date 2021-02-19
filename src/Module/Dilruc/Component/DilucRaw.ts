import ComponentRaw from "../../../Core/Citius/ComponentRaw";
import StockAssetRaw from "../Exchange/StockAssetRaw";

export default interface DilucRaw extends ComponentRaw {
	assets: StockAssetRaw<any>[];
}