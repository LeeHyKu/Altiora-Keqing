import StockAssetRaw from "./StockAssetRaw";
import StockTransactionResult from "./StockTransactionResult";

export default interface StockBuyResult<O> extends StockTransactionResult {
	asset: StockAssetRaw<O>
}