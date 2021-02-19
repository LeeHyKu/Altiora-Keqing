import Keqing from "./Keqing";

export default class KeqingBase {
	constructor(private _Keqing: Keqing) { }

	protected get Keqing() { return this._Keqing; }
	protected get Client() { return this.Keqing.Client; }
	protected get Qurare() { return this.Keqing.Qurare; }
	protected get Citius() { return this.Keqing.Citius; }
	protected get Karin() { return this.Keqing.Karin; }
	protected get Nakiri() { return this.Keqing.Nakiri; }
	protected get Lamy() { return this.Keqing.Lamy; }
}