import Link from "../Items/Link";
import TailerEx from "./TailerEx";

const _VA = '6.0.0';
const _VI = '5.9.8';
const _VW = '2.5.1';
const _VM = '2.2.0';

export default class TailBuilder {
	SID: string; DID: string; SNM: string; SIC: string; SL?: Link;
	VA: string = _VA; VI: string = _VI; VW: string = _VW; VM: string = _VM;

	constructor(tailer?: string, tailimg?: string, dev?: string, srv?: string, link?: Link) {
		if (tailer) this.Tail(tailer);
		if (tailimg) this.Tailimg(tailimg);
		if (dev) this.Dev(dev);
		if (srv) this.Service(srv);
		if (link) this.Link(link);
	}

	Tail(tail: string) { this.SNM = tail; return this; }
	Tailimg(img: string) { this.SIC = img; return this; }
	Service(id: string) { this.SID = id; return this; }
	Dev(id: string) { this.DID = id; return this; }
	Link(link: Link) { this.SL = link; return this; }

	Go(preview: string, tail?: string, timg?: string, link?: Link): TailerEx {
		var result = Object.assign(this);

		result['ME'] = preview;
		if (tail) result['SNM'] = tail;
		if (timg) result['SIC'] = timg;
		if (link) result['SL'] = link;
		return result;
	}
}