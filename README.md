# DiscordIdeasToSpreadsheet
A Discord bot that reads messages in a channel and writes them to a CSV file.

This was made for Instafluff's **The Comfy Corner** Discord server where the community adds ideas to an "Idears" channel.

It uses **ComfyDiscord** (https://github.com/instafluff/comfydiscord) as a base for the Discord bot.

Requires Node.js and a Discord bot application token.
Also make sure the Discord bot is added to the server.

## Features ##

Whenever a message comes into the specified Discord channel, it will upload it to the Google sheet.

In order to upload the message history, you can use the **!GetOldIdears** command.

If the bot goes down for a while, you can use the **!GetNewIdears** command to fetch the ideas that were missed while it was down.

## Instructions ##

Install ComfyDiscord
```
npm install comfydiscord –save
```

Install dotenv
```
npm install dotenv –save
```

Your .env file should have the following variables:
```
DISCORDTOKEN=discord_token_here
IDEARCHANNEL=channel_name_here
```
