import { CommercePriceFragment } from "node-kakao";
import ItemBuilder from "../../Builders/ItemBuilder";
import CommercePrice from "./CommercePrice";

export default class CommercePriceBuilder extends ItemBuilder<CommercePriceFragment> implements CommercePrice {
	RP: number;
	DP: number;
	DR: number;
	CU: string;
	CP: 0 | 1 = 0;

	constructor(real?: number, discount?: number, rate?: number, unit?: string, first?: 0 | 1) {
		super();
		if (real) this.RealPrice(real);
		if (discount) this.Discount(discount);
		if (rate) this.DiscountRate(rate);
		if (unit) this.Unit(unit);
		if (first) this.UnitFirst(first);
	}

	RealPrice(price: number) { this.RP = price; return this; }
	Discount(price: number) { this.DP = price; return this; }
	DiscountRate(rate: number) { this.DR = rate; return this; }
	Unit(name: string) { this.CU = name; return this; }
	UnitFirst(bool: 0 | 1) { this.CP = bool; return this; }

	Build() { var cp = new CommercePriceFragment(); cp.readRawContent(this); return cp; }
}