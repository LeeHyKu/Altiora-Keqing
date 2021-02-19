import BeyondAsset from "./BeyondAsset";
import Domestic from "./Domestic";

export default class DomesticAsset extends BeyondAsset<Domestic> {
	protected isForeign(): boolean { return false; }
	public Fee(): number { return 0.004; }
}