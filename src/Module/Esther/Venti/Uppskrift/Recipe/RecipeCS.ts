import Keqing from "../../../../../Core/Keqing";
import Recipe from "./Recipe";
import RecipeRaw from "./RecipeRaw";

export default interface RecipeCS { new(keqing: Keqing, raw: RecipeRaw): Recipe<any>; }