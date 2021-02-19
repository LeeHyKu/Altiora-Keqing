import { isArray } from "util";
import Item from "../../Item";
import ItemCS from "../../ItemCS";
import EnhancerRaw from "./EnhancerRaw";
import EnhanceScale from "./EnhanceScale";

export default class Enhancer extends Item<EnhancerRaw>{
	private ehid: string;
	private surt: [number, number, number, number, number, number, number, number, number, number];
	private scale: EnhanceScale | [EnhanceScale, EnhanceScale, EnhanceScale, EnhanceScale, EnhanceScale, EnhanceScale, EnhanceScale, EnhanceScale, EnhanceScale, EnhanceScale];
	public get Ehid() { return this.ehid; }
	public get Surt() { return this.surt; }
	public get Scale() { return this.scale; }

	protected Installation(raw: EnhancerRaw) {
		this.ehid = raw.ehid;
		this.surt = raw.surt;
		this.scale = raw.scale;
	}
	protected Export(): EnhancerRaw {
		return {
			ehid: this.ehid,
			surt: this.surt,
			scale: this.scale
		};
	}
	protected Structor(): ItemCS { return Enhancer; }
	public getScale(num: number) {
		if (isArray(this.scale)) return this.scale[num - 1];
		else return this.scale;
	}

	protected HashOpt(): string { return `${this.ehid}:${this.surt.reduce((a,b) => a+b)}`; }
}