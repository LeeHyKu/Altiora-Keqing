import OccupationStatus from "./OccupationStatus";
import OccupationStatusDefault from "./OccupationStatusDefault";

type OccupationStatusM<T extends OccupationStatus> = T & OccupationStatusDefault;
export default OccupationStatusM;