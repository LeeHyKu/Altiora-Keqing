import KeqingBase from "../../Core/KeqingBase";
import * as jsonfile from "jsonfile";

const ConstrueList = "./res/Shiritori/AllWordList.srt";
const FirstTypeList = "./res/Shiritori/StartWordList.srt";

export default class Wordmap extends KeqingBase {
	private _words: WordConstrue;
	private _firsts: WordFirstType;
	public get Words() { return this._words; }
	public get Firsts() { return this._firsts; }
	public get Installed() { return this._words && this._firsts; }

	public async Ignition() {
		if (this.Installed) return;
		else {
			this._words = await jsonfile.readFileSync(ConstrueList);
			this._firsts = await jsonfile.readFileSync(FirstTypeList);
		}
	}

	public getNextChar(last: string): string {
		var hex = last.charCodeAt(0) - 0xAC00;
		if (hex < 0x0000 || hex > 0x2BA3) return last;

		var RIEUL_TO_NIEUN = [0x1161, 0x1162, 0x1169, 0x116C, 0x116E, 0x1173];
		var RIEUL_TO_IEUNG = [0x1163, 0x1167, 0x1168, 0x116D, 0x1172, 0x1175];
		var NIEUN_TO_IEUNG = [0x1167, 0x116D, 0x1172, 0x1175];

		var onset = Math.floor(hex / 0x1C / 0x15) + 0x1100,
			nuclus = (Math.floor(hex / 0x1C) % 0x15) + 0x1161,
			coda = (hex % 0x1C) + 0x11A7;

		switch (onset) {
			case 0x1105:
				if (RIEUL_TO_NIEUN.some(e => e === nuclus)) onset = 0x1102;
				else if (RIEUL_TO_IEUNG.some(e => e === nuclus)) onset = 0x110B;
				else return last;
				break;
			case 0x1102:
				if (NIEUN_TO_IEUNG.some(e => e === nuclus)) onset = 0x110B;
				else return last;
				break;
			default:
				return last;
		}
		onset -= 0x1100;
		nuclus -= 0x1161;
		coda -= 0x11A7;
		return String.fromCharCode(((onset * 0x15) + nuclus) * 0x1C + coda + 0xAC00);
	}

	public getRandomWord() { return Object.keys(this.Words)[Math.floor(Math.random() * Object.keys(this.Words).length)]; }
	public getFirstWord(first: string) { return this.Firsts[first]; }
	public getFirstChar(word: string) { return word[0]; }
	public getLastChar(word: string) { return word[word.length - 1]; }

	public isWord(word: string) { return !!this.Words[word]; }
	public isFirstChar(first: string) { return !!this.Firsts[first]; }
	public isDecisive(word: string) {
		if (this.isFirstChar(this.getLastChar(word))) return false;
		else return !this.isFirstChar(this.getNextChar(this.getLastChar(word)));
	}

	public getWordMean(word: string) {
		if (this.isWord(word)) return this.Words[word].slice(0, 3).map((e, i) => `「${i+1}」 ${e}`).join('\r\n');
		else return '알 수 없는 단어';
	}
}

interface WordConstrue { [word: string]: string[]; }
interface WordFirstType { [first: string]: string[]; }