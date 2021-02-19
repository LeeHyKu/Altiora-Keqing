import ComponentRaw from "../../../Core/Citius/ComponentRaw";

export default interface EricaRaw extends ComponentRaw {
	money: number;

	exp: number;
	achieved: number;
	alarm: boolean;

	attandance?: Date;
}