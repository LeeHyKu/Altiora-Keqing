import KeqingAttachment from "../../Core/KeqingAttachment";
import EstherStatsCommand from "./Commands/Esther/EstherStatsCommand";
import InventoryCommand from "./Commands/Inventory/InventoryCommand";
import InventoryHandoverCommand from "./Commands/Inventory/InventoryHandoverCommand";
import RecipeCommand from "./Commands/Recipe/RecipeCommand";
import RecipeCreateCommand from "./Commands/Recipe/RecipeCreateCommand";
import VentiContractCommand from "./Commands/Venti/VentiContractCommand";
import VentiEnhanceCommand from "./Commands/Venti/VentiEnhanceCommand";
import VentiProvisionCommand from "./Commands/Venti/VentiProvisionCommand";

export default <KeqingAttachment>{
	command: [
		EstherStatsCommand,
		InventoryCommand,
		InventoryHandoverCommand,
		//VentiContractCommand,
		VentiProvisionCommand,
		//VentiEnhanceCommand,
		RecipeCommand,
		//RecipeCreateCommand
	]
};