import StockOverHeaderResult from "./StockOverHeaderResult";

export default interface StockOverHeadResultM {
	result?: StockOverHeaderResult;
	resultCode: "success" | "error";
}