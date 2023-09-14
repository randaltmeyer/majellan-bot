# Majellan Bot
A simple bot for searching DQT (Dragon Quest Tact) units

## Server Invite
https://discord.com/api/oauth2/authorize?client_id=1115758468486397952&permissions=274877910016&scope=bot%20applications.commands

## Repo Setup
git clone git@github.com:randaltmeyer/majellan-bot.git
cd majellan-bot
mkdir data
mkdir data/bots
echo '{"id":"1115758468486397952","token":""}' > ./data/bots/1115758468486397952.json
npm i
npm run build
npm run crawl
npm start

### Environment Variables
> botId

The Discord Id for the bot.

> devServerId

The Discord Id for the Discord server/guild that is considered the development server.
When running in development mode, the bot will only respond to messages in the development server.

### NPM Scripts
> npm start
> npm stop
> npm restart
> npm run delete

Performs pm2 start/stop/restart/delete actions against ecosystem.config.cjs.
These are all done in the development environment.

> npm run start-prod

Starts the bot in production mode.

> npm run build

Performs a tsc clean and then a tsc build.

> npm run crawl

Runs `npm run build` before crawling for data that hasn't been crawled yet

> npm run crawl-full

Runs a crawl w/o reading cache, thus performing a complete/full crawl

> npm run update

Runs a crawl that just looks for new units or updates recent units
