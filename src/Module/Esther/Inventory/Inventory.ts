import { CustomType } from "node-kakao";
import UserComponent from "../../../Core/Citius/User/UserComponent";
import CarouselBuilder from "../../../Core/Karin/Contents/Carousel/CarouselBuilder";
import Feed from "../../../Core/Karin/Contents/Feed/Feed";
import FeedBuilder from "../../../Core/Karin/Contents/Feed/FeedBuilder";
import Zhongli from "../../Zhongli/Zhongli";
import Item from "../Venti/Item";
import ItemC from "../Venti/ItemC";
import Efni from "../Venti/Items/Efni/Efni";
import Material from "../Venti/Items/Material/Material";
import Recipe from "../Venti/Uppskrift/Recipe/Recipe";
import RecipeC from "../Venti/Uppskrift/Recipe/RecipeC";
import Uppskrift from "../Venti/Uppskrift/Uppskrift";
import Venti from "../Venti/Venti";
import InventoryRaw from "./InventoryRaw";

export default class Inventory extends UserComponent<InventoryRaw>{
	private _items: Item<any>[];
	private _recipes: Recipe<any>[];
	protected get ItemList() { return this._items.filter(e => !e.Destroyed); }
	protected get Recipes() { var r = this.Citius.GetSingleton(Zhongli).GetJoined(this.Data.ID)?.Recipes?.(this.Data.ID); return r ? [...this._recipes, ...r] : this._recipes; }

	public AddItem(...items: Item<any>[]) { this._items.push(...items); }
	public get Items() { return this._items; }
	public Focus<T extends Item<any> = Item<any>>(uid: string, struct?: ItemC<any, T>) { return <T>this.ItemList.find(e => (e.Name === uid.replace(/_/, ' ') || e.Uid === uid.toLowerCase()) && (!struct || e instanceof struct)); }
	public FocusMatid<T extends Material>(matid: string, struct?: ItemC<any, T>) { return <T>this.ItemList.find(e => e instanceof (struct || Material) && ((<Material>e).Matid === matid || e.Name === matid.replace(/_/, ' ') || e.Uid === matid.toLowerCase())); }
	public FocusMatidOnly<T extends Material>(matid: string, struct?: ItemC<any, T>) { return <T>this.ItemList.find(e => e instanceof (struct || Material) && ((<Material>e).Matid === matid)); }

	public RemoveItem<T extends Item<any> = Item<any>>(uid: string, struct?: ItemC<any, T>) {
		var index = this.ItemList.findIndex(e => (e.Name === uid || e.Uid === uid.toLowerCase()) && (!struct || e instanceof struct));
		if (index === -1) return null;
		else return <T>this._items.splice(index, 1)[0];
	}

	public AddRecipe(recipe: Recipe<any>) { this._recipes.push(recipe); }
	public GetRecipe<T extends Recipe<any>>(uid: string, struct?: RecipeC<any, T>) { return <T>this.Recipes.find(e => (e.Name === uid.replace(/_/, '') || e.Id === uid.toLowerCase()) && (!struct || e instanceof struct)); }
	public UseRecipe(uid: string) {
		var recipe = this.GetRecipe(uid);
		if (!recipe) return null;
		else {
			var items: Efni[] = recipe.Recipe.map(e => <Efni>this.RemoveItem(this.FocusMatidOnly(e.matid, Efni)?.Uid), Efni).filter(e => e);
			var make = recipe.Combine(items, this.Data);
			if (!make.result) this.AddItem(...items);
			else this.AddItem(make.result);
			return make;
		}
	}
	public GetRecipeOwnOnly<T extends Recipe<any>>(uid: string, struct?: RecipeC<any, T>) { return <T>this._recipes.find(e => (e.Name === uid.replace(/_/, '') || e.Id === uid.toLowerCase()) && (!struct || e instanceof struct)); }

	public get Karins(): FeedBuilder | CarouselBuilder<Feed> {
		if (this.Items.length < 1) return this.Karin.Reject('인벤토리에 아이템이 없습니다', '아이템없음');
		else return this.Karin.Carousel<Feed>(CustomType.FEED, '인벤토리').add(...this.Items.map(e => e.Feed()));
	}
	public get RecipeKarin(): FeedBuilder | CarouselBuilder<Feed> {
		if (this.Recipes.length < 1) return this.Karin.Reject('사용할 수 있는 레시피가 없습니다', '레시피없음');
		else return this.Karin.Carousel<Feed>(CustomType.FEED, '레시피').add(...this.Recipes.map(e => e.Feed()));
	}

	protected Initialization(): InventoryRaw {
		return {
			items: [],
			recipes: [],
		}
	}
	protected Installation(raw: InventoryRaw) {
		this._items = raw.items.map(e => this.Citius.GetSingleton(Venti).CreateByName(this.Data, e));
		this._recipes = raw.recipes.map(e => new (this.Citius.GetSingleton(Uppskrift).GetByName(e.struct))(this.Keqing, e))
	}
	public Raw(): InventoryRaw {
		return {
			items: this.ItemList.map(e => e.RawI()).filter(e => e && e.item),
			recipes: this._recipes.map(e => e.Raw())
		};
	}
}