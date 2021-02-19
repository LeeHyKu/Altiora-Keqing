import Keqing from "../../../../../Core/Keqing";
import Gear from "../../Items/Gear/Gear";
import Recipe from "./Recipe";
import RecipeRaw from "./RecipeRaw";

export default interface RecipeC<T extends Gear, R extends Recipe<T>> { new(keqing: Keqing, raw: RecipeRaw): R; }