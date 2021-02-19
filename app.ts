import * as Auth from "./Auth.json";

import Keqing from "./src/Core/Keqing";
import DilucModule from "./src/Module/Dilruc/DilucModule";
import EricaModule from "./src/Module/Erica/EricaModule";
import EstherModule from "./src/Module/Esther/EstherModule";
import OccupationModule from "./src/Module/Esther/Occupation/OccupationModule";
import PresetModule from "./src/Module/Esther/Venti/Preset/PresetModule";
import UppskriftModule from "./src/Module/Esther/Venti/Uppskrift/UppskriftModule";
import VentiModule from "./src/Module/Esther/Venti/VentiModule";
import FenrirModule from "./src/Module/Fenrir/FenrirModule";
import GomokuModule from "./src/Module/Gomoku/GomokuModule";
import KaguraModule from "./src/Module/Kagura/KaguraModule";
import OdinModule from "./src/Module/Odin/OdinModule";
import ShiritoriModule from "./src/Module/Shiritori/ShiritoriModule";
import UtilModule from "./src/Module/Utils/UtilModule";
import ZhongliModule from "./src/Module/Zhongli/ZhongliModule";


var keqing = new Keqing({
	Keqing: Auth, //note: 같은 폴더에 'Auth.json' 생성하여 정보 입력해주세요
	Prefix: '?',
	NakiriTime: 50000,
	Karin: {
		Developer: '당신의 이름을 입력하세요',
		Service: '봇 이름을 입력하세요',
		Favicon: '파비콘 url을 입력하세요',
		Slogan: 'Project Keqing by HKLee',

		ProfileIcon: '프로필 아이콘 url을 입력하세요',
		ProfileName: '봇 이름을 입력하세요'
	},
	Citius: {
		DBPath: 'mongodb 데이터베이스 서버 url을 입력하세요',
		DBName: 'mondodb 데이터베이스 이름을 입력하세요',
		Tables: {
			Channel: '채널 테이블 이름을 입력하세요',
			User: '유저 테이블 이름을 입력하세요'
		}
	}
});

keqing.AttachModule(EricaModule);
keqing.AttachModule(FenrirModule);
keqing.AttachModule(KaguraModule);

keqing.AttachModule(EstherModule);
keqing.AttachModule(OccupationModule);
keqing.AttachModule(VentiModule);
keqing.AttachModule(UppskriftModule);
keqing.AttachModule(PresetModule);

keqing.AttachModule(ZhongliModule);
keqing.AttachModule(DilucModule);

keqing.AttachModule(ShiritoriModule);
keqing.AttachModule(GomokuModule);
keqing.AttachModule(OdinModule);

keqing.AttachModule(UtilModule);
keqing.Ignition();
