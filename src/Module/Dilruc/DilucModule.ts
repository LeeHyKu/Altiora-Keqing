import KeqingAttachment from "../../Core/KeqingAttachment";
import EnterpriseAsset from "../Zhongli/Enterprise/EStock/EnterpriseAsset";
import DilucBeyondCommand from "./Command/DilucBeyondCommand";
import Diluc from "./Diluc";
import DomesticAsset from "./Exchange/Beyond/Stock/DomesticAsset";
import ForeignAsset from "./Exchange/Beyond/Stock/ForeignAsset";
import StockAssetCS from "./Exchange/StockAssetCS";

const Assets: StockAssetCS[] = [
	DomesticAsset,
	ForeignAsset,
	EnterpriseAsset
];
export default <KeqingAttachment>{
	command: [
		DilucBeyondCommand
	],
	afterIgnition: async keqing => {
		keqing.Citius.GetSingleton(Diluc).Attach(...Assets);
	}
};