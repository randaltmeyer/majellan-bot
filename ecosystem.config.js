module.exports = {
	apps: [{
		name: "dqt-sage",
		script: "./dist/app.mjs",

		env: {
			NODE_ENV: "development",
		},
		env_production: {
			NODE_ENV: "production"
		},

		error_file: "./logs/dqt-sage-error.log",
		out_file: "./logs/dqt-sage-out.log",
		log_date_format: "YYYY-MM-DD",
		time: true,

	}]
}