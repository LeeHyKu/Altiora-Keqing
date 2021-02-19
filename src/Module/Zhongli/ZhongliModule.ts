import KeqingAttachment from "../../Core/KeqingAttachment";
import EnterpriseBuildCommand from "./Commands/EnterpriseBuildCommand";
import EnterpriseCommand from "./Commands/EnterpriseCommand";
import ZhongliCommand from "./Commands/ZhongliCommand";
import Zhongli from "./Zhongli";

export default <KeqingAttachment>{
	command: [
		EnterpriseBuildCommand,
		EnterpriseCommand,
		ZhongliCommand
	],
	afterIgnition: async keqing => await keqing.Citius.GetSingleton(Zhongli).Ignition(),
	splashaction: async keqing => await keqing.Citius.GetSingleton(Zhongli).SaveAll()
}