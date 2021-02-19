import UserData from "../../../Core/Citius/User/UserData";
import Keqing from "../../../Core/Keqing";
import Occupation from "./Occupation";

export default interface OccupationCS { new(keqing: Keqing, data: UserData, raw: any): Occupation<any>; }