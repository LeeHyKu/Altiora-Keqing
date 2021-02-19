import KeqingBase from "../../../../../Core/KeqingBase";
import BeataT from "./BeataT";

export default class Beata extends KeqingBase {
	private beata: BeataT[] = [{ name: '룬', info: '노르딕 지역에서 사용하던 강화서입니다.' }];
	public get Beata() { return this.beata; }
	public Attach(...beata: BeataT[]) { this.beata.push(...beata); }
	public IsBeata(str: string) { return this.Beata.some(e => e.name === str); }
}