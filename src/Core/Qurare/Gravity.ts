import * as chalk from "chalk"; 

enum Gravity {
	MINOR = 'min',
	NORMAL = 'nor',
	FOCUS = 'foc',

	CAUTION = 'cau',
	WARNING = 'war',
	ERROR = 'err',

	IMPORTANT = 'imp',
	FATAL = 'fat'
};
namespace Gravity {
	export const Kr = {
		min: '사소',
		nor: '일반',
		foc: '집중',

		cau: '주의',
		war: '경고',
		err: '오류',

		imp: '중요',
		fat: '심각'
	};
	export const Color = {
		min: chalk.gray,
		nor: chalk.blueBright,
		foc: chalk.blue,

		cau: chalk.yellow,
		war: chalk.redBright,
		err: chalk.red,

		imp: chalk.bgBlue,
		fat: chalk.bgRed
	}
}
export default Gravity;