import KeqingBase from "../../KeqingBase";

export default abstract class Cacher<T> extends KeqingBase {
	protected abstract Check(): boolean | Promise<boolean>;
	protected abstract OnUpdate(): any | Promise<any>;
	protected abstract Update(): T | Promise<T>;

	private _data: T;
	protected get Data() { return this._data; }
	public async Get(): Promise<T> {
		if (!this.Data || !(await this.Check())) await this.DoUpdate();
		return this.Data;
	}
	protected async DoUpdate() { this._data = await this.Update(); await this.OnUpdate(); }
}