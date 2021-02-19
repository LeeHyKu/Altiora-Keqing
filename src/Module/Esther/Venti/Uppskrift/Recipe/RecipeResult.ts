import Gear from "../../Items/Gear/Gear";
import RecipeStatus from "./RecipeStatus";

export default interface RecipeResult<T extends Gear> {
	status: RecipeStatus;
	result?: T;
}