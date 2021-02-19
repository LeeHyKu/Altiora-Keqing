import * as Auth from "../../../../../Auth.json";

import Cacher from "../../../../Core/Citius/base/Cacher";
import Axios from "axios";

const API = 'https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?data=AP01&authkey={0}&searchdate={1}';

export default class CurrencyExchange extends Cacher<Map<string, number>> {
	readonly backup: {
		USD: 1010,
		JPY: 10,

	};

	private date: Date;
	protected Check(): boolean {
		return Date.now() - this.date.getTime() < 7200000
	}
	protected OnUpdate() {
		this.date = new Date();
	}
	protected async Update(): Promise<Map<string, number>> {
		var a = new Map();
		var date = new Date();
		for (var i = 0; i < 13; i++) {
			var req = ((await Axios.get(API.replace('{0}', Auth.CurrencyApi).replace('{1}', date.toISOString().split('T')[0].split('-').join('')), { responseType: "json" })).data as Array<any>)
			if (req.length > 0) {
				req.forEach(e =>
					a.set(
						e['cur_unit'].replace?.('(100)', ''),
						+(e['cur_unit'].endsWith?.('(100)') ? parseFloat(e['tts'].replace(',', '')) / 100 : parseFloat(e['tts'].replace(',', ''))).toFixed(3)
					));
				break;
			}

			date.setDate(date.getDate() - 1);
		}
		for (var key in this.backup)
			if (!a.has(key))
				a.set(key, this.backup[key]);
		return a;
	}

	public async GetRate(name: string) {
		return (await this.Get()).get(name) || 1;
	}
}