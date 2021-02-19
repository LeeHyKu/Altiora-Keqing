import UserData from "../../../Core/Citius/User/UserData";
import Keqing from "../../../Core/Keqing";
import Occupation from "./Occupation";
import OccupationStatus from "./OccupationStatus";

export default interface OccupationC<R extends OccupationStatus, T extends Occupation<R>> { new(keqing: Keqing, data: UserData, raw: R): T; }