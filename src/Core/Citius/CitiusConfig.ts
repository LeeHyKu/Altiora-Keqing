export default interface CitiusConfig {
	DBPath: string;
	DBName: string;
	Tables: {
		[tablename: string]: string,
		Channel: string,
		User: string
	};
}