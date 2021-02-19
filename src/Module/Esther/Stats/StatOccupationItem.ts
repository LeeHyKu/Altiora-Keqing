import OccupationStatus from "../Occupation/OccupationStatus";

type StatOccupationItem<T extends OccupationStatus> = { [K in keyof T]: T[K]; } & { occupation: string; }
export default StatOccupationItem;