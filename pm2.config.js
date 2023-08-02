module.exports = {
	apps: [{
		name: "majellan-bot",
		script: "./dist/app.mjs",

		env: {
			NODE_ENV: "development",
			botName: "dev"
		},
		env_production: {
			NODE_ENV: "production",
			botName: "prod"
		},

		error_file: "./logs/majellan-bot-error.log",
		out_file: "./logs/majellan-bot-out.log",
		log_date_format: "YYYY-MM-DD",
		time: true,

	}]
}