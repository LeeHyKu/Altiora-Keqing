import CitiusConfig from "./Citius/CitiusConfig";
import KarinConfig from "./Karin/KarinConfig";

export default interface KeqingConfig {
	Keqing: {
		ID: string,
		Password: string,
		UUID: string,
		AccessFrom: string
	}
	Prefix: string,
	NakiriTime: number
	Citius: CitiusConfig,
	Karin: KarinConfig
}