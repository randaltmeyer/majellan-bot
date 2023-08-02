# DQT Sage
Dragon Quest Tact Sage - A simple bot for searching DQT units

## Installation
https://discord.com/api/oauth2/authorize?client_id=1115758468486397952&permissions=274877910016&scope=bot%20applications.commands

## Repo Setup
git clone git@github.com:randaltmeyer/majellan-bot.git
cd majellan-bot
mkdir data
mkdir data/bots
echo '{"id":"","token":""}' > ./data/bots/dev.json
echo '{"id":"","token":""}' > ./data/bots/prod.json
npm i
tsc -p tsconfig.json
cd dist
node crawl.mjs
cd ..
pm2 start pm2.config.js