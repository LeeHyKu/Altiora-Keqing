export default interface StockForeignResult {
	stockEndType: string;
	reutersCode: string;
	stockName: string;
	stockNameEng: string;
	symbolCode: string;
	stockExchangeType: {
		name: string;
		nameKor: string;
		nameEng: string;
		delayTime: number; //분단위
		zoneId: string;
		startTime: string;
		endTime: string;
		nationType: string;
	};
	currencyType: {
		code: string;
		text: string;
		name: string;
	}
	marketStatus: string; //"OPEN" | "CLOSE"
	closePrice: string;
	compareToPreviousClosePrice: string;
	fluctuationsRatio: number;
	delayTime: number;
	imageCharts: {
		transparent: string;
		candleMonth: string;
		areaYear: string;
		areaYearThree: string;
		areaYearTen: string;
		day_up_tablet: string;
		candleWeek: string;
		areaMonthThree: string;
		day: string;
		day_up: string;
		candleDay: string;
	}
}