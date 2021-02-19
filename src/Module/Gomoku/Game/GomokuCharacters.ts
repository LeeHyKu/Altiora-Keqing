import GomokuError from "../GomokuError";

namespace GomokuCharacters {
	export const TOP_LEFT = '┏';
	export const TOP_CENTER = '┳';
	export const TOP_RIGHT = '┓';
	export const CENTER_LEFT = '┣';
	export const CENTER_CENTER = '╋';
	export const CENTER_RIGHT = '┫';
	export const BOTTOM_LEFT = '┗';
	export const BOTTOM_CENTER = '┻';
	export const BOTTOM_RIGHT = '┛';

	export const Vertical = [
		'1',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9',
		'A', //10; Minimum size
		'B',
		'C', //12; Standard size
		'D',
		'E',
		'F',
		'G',
		'H',
		'I',
		'J',
		'K',
		'L',
		'M',
		'N',
		'O',
		'P',
		'Q' //26; Maximum size
	];
	export const Horizontal = [
		'Ａ',
		'Ｂ',
		'Ｃ',
		'Ｄ',
		'Ｅ',
		'Ｆ',
		'Ｇ',
		'Ｈ',
		'Ｉ',
		'Ｊ', //10; Minimum size
		'Ｋ',
		'Ｌ', //12; Standard size
		'Ｍ',
		'Ｎ',
		'Ｏ',
		'Ｐ',
		'Ｑ',
		'Ｒ',
		'Ｓ',
		'Ｔ',
		'Ｕ',
		'Ｖ',
		'Ｗ',
		'Ｘ',
		'Ｙ',
		'Ｚ' //26; Maximum size
	];

	export const BLACK = '●';
	export const WHITE = '○';

	export function VecticalNumber(index: string) {
		var char = index[0];
		var num = +char;
		if (isNaN(num)) {
			switch (char.toUpperCase()) {
				case 'A':
					return 9;
				case 'B':
					return 10;
				case 'C':
					return 11;
				case 'D':
					return 12;
				case 'E':
					return 13;
				case 'F':
					return 14;
				case 'G':
					return 15;
				case 'H':
					return 16;
				case 'I':
					return 17;
				case 'J':
					return 18;
				case 'K':
					return 19;
				case 'L':
					return 20;
				case 'M':
					return 21;
				case 'N':
					return 22;
				case 'O':
					return 23;
				case 'P':
					return 24;
				case 'Q':
					return 25;
				default:
					throw new GomokuError('unknown character');
			}
		}
		else if (num < 10 && num >= 0) return --num;
		else throw new GomokuError('unknown character');
	}
	export function HorizontalNumber(index: string) {
		switch (index[0].toUpperCase()) {
			case 'A':
				return 0;
			case 'B':
				return 1;
			case 'C':
				return 2;
			case 'D':
				return 3;
			case 'E':
				return 4;
			case 'F':
				return 5;
			case 'G':
				return 6;
			case 'H':
				return 7;
			case 'I':
				return 8;
			case 'J':
				return 9;
			case 'K':
				return 10;
			case 'L':
				return 11;
			case 'M':
				return 12;
			case 'N':
				return 13;
			case 'O':
				return 14;
			case 'P':
				return 15;
			case 'Q':
				return 16;
			case 'R':
				return 17;
			case 'S':
				return 18;
			case 'T':
				return 19;
			case 'U':
				return 20;
			case 'V':
				return 21;
			case 'W':
				return 22;
			case 'X':
				return 23;
			case 'Y':
				return 24;
			case 'Z':
				return 25;
			default:
				throw new GomokuError('unknown character');
		}
	}
}
export default GomokuCharacters;