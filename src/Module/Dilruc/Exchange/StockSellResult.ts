import StockTransactionResult from "./StockTransactionResult";

export default interface StockSellResult extends StockTransactionResult {
	feeRate: number;
}