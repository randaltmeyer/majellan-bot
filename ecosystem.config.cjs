module.exports = {
	apps: [{
		name: "majellan-bot",
		script: "./dist/app.mjs",

		env: {
			NODE_ENV: "development",
			botId: "1115758468486397952",
			devServerId: "1118582629424439346",
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