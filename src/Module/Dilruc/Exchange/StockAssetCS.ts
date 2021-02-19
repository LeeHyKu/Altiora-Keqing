import UserData from "../../../Core/Citius/User/UserData";
import Keqing from "../../../Core/Keqing";
import StockAssetRaw from "./StockAssetRaw";

export default interface StockAssetCS { new(keqing: Keqing, user: UserData, raw: StockAssetRaw<any>); }