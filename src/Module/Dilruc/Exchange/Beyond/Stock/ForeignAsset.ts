import BeyondAsset from "./BeyondAsset";
import Foreign from "./Foreign";

export default class ForeignAsset extends BeyondAsset<Foreign>{
	protected isForeign(): boolean { return true; }
	public Fee(): number { return 0.02 }
}