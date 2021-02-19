export default interface StockAssetRaw<T> {
	struct: string;
	id: string;
	name: string;
	amount: number;
	option: T;
}