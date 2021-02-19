import DilucRegion from "./DilucRegion";

export default interface BeyondStockInfo {
	id: string;
	name: string;
	region: string;
	regionInfo: DilucRegion;
	cost: number;
	costdifn: number;
	costdifr: number;
	opened: boolean;
	image?: string;
	updtime: Date;
}