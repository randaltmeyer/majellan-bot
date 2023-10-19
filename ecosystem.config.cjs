module.exports = {
	apps: [{
		name: "majellan-bot",
		script: "./dist/app.mjs",

		env: {
			NODE_ENV: "development",
			botId: "1115758468486397952",
			/** the bot's dev / home server */
			devServerId: "1118582629424439346",
			/** a channel on the dev server that only the dev bot can respond to */
			devChannelId:  "1164386828086935634",
			/** a channel on the dev server that only the live bot can respond to */
			liveChannelId: "1164386784734613564",
		},
		env_production: {
			NODE_ENV: "production",
		},

		error_file: "./logs/majellan-bot-error.log",
		out_file: "./logs/majellan-bot-out.log",
		log_date_format: "YYYY-MM-DD",
		time: true,

	}]
}