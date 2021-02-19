import Keqing from "../Keqing";
import KeqingBase from "../KeqingBase";
import CarouselBuilder from "./Contents/Carousel/CarouselBuilder";
import ContentType from "./Contents/Carousel/ContentType";
import Commerce from "./Contents/Commerce/Commerce";
import CommerceBuilder from "./Contents/Commerce/CommerceBuilder";
import Feed from "./Contents/Feed/Feed";
import FeedBuilder from "./Contents/Feed/FeedBuilder";
import List from "./Contents/List/List";
import ListBuilder from "./Contents/List/ListBuilder";
import Link from "./Items/Link";
import ProfileBuilder from "./Items/ProfileBuilder";
import { TextBuilder } from "./Items/TextBuilder";
import KarinConfig from "./KarinConfig";
import TailBuilder from "./Tail/TailBuilder";

export default class Karin extends KeqingBase {
	constructor(base: Keqing, private _config: KarinConfig) { super(base); }
	public get Tail() { return new TailBuilder(this._config.Slogan, this._config.Favicon, this._config.Developer, this._config.Service, this._config.Link); }
	public get Profile() { return new ProfileBuilder({ T: this._config.ProfileName }, { H: 200, W: 200, THU: this._config.ProfileIcon }, null, this._config.Link); }

	public Carousel<T extends Feed | List | Commerce>(type: ContentType<T>, pre: string) { return new CarouselBuilder<T>(this.Tail.Go(pre), type); }
	public Commerce(pre: string, tail?: string, link?: Link) { return new CommerceBuilder(this.Tail.Go(pre, tail, null, link)); }
	public List(pre: string, tail?: string, link?: Link) { return new ListBuilder(this.Tail.Go(pre, tail, null, link)); }
	public Feed(pre: string, tail?: string, link?: Link) { return new FeedBuilder(this.Tail.Go(pre, tail, null, link)); }
	public FeedS(pre: string, tail?: string, link?: Link) { return this.Feed(pre, tail, link).Profile(this.Profile); }

	public Confirm(desc: string, title?: string, tail?: string) { return this.Feed('실행성공', tail || 'A deo vocatus rite paratus').Text(new TextBuilder(title || '실행성공', desc || '설명없음')).TextFull(true); }
	public Reject(desc: string, title?: string, tail?: string) { return this.Feed('실행실패', tail || 'Aliis si licet, tibi non licet').Text(new TextBuilder(title || '실행실패', desc || '설명없음')).TextFull(true); }
	public Error(error: Error, tail?: string) { return this.Feed('오류발생', tail || 'Domine, Quo Vadis?').Text(new TextBuilder(error.name || '알 수 없는 오류', error.message || '설명없음')); }
}