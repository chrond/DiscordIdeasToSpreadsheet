require( "dotenv" ).config();

var ComfyDiscord = require( "comfydiscord" );
ComfyDiscord.onCommand = ( channelName, user, command, msg, flags, extra ) => {
	if ( command.toLowerCase() === "getoldidears" ) {
		if (channelName == process.env.IDEARCHANNEL) {
			let batchSize = 10;
			let earliestMessageId = "";
			let earliestDate = new Date(3000, 1);
			getMessages(extra.channel, batchSize, earliestMessageId, earliestDate, true);
		}
	}
	else if ( command.toLowerCase() === "getnewidears" ) {
		if (channelName == process.env.IDEARCHANNEL) {
			let batchSize = 10;
			let newestMessageId = "";
			let newestDate = new Date(1990, 1);
			getMessages(extra.channel, batchSize, newestMessageId, newestDate, false);
		}
	}
	else {
		//Looks like a command but should be treated as a regular comment
		if (channelName == process.env.IDEARCHANNEL) {
			console.log(extra.id + " - " + (new Date()).toISOString() + " - " + user + " - " + "!" + command + " " + extra.cleanContent);
		}
	}
}
ComfyDiscord.onChat = ( channelName, user, msg, flags, extra ) => {
	if (channelName == process.env.IDEARCHANNEL) {
		console.log(extra.id + " - " + (new Date()).toISOString() + " - " + user + " - " + extra.cleanContent);
	}
}
ComfyDiscord.Init( process.env.DISCORDTOKEN );


function getMessages(channel, batchSize, messageId, date, getOldMessages) {
	let options = { limit: batchSize };
	
	if (getOldMessages && messageId != "") {
		options.before = messageId;
	}
	else if (!getOldMessages && messageId != "") {
		options.after = messageId;
	}

	// Get the next batch of messages
	channel.fetchMessages(options)
		.then( messages => {
			console.log('Received ' + messages.size + ' messages.');
			
			for (let m of messages.values()) {
				if (messageId == "" || (getOldMessages && m.createdAt <= date) || (!getOldMessages && m.createdAt > date)) {
					messageId = m.id;
					date = m.createdAt;
				}
				console.log(m.id + " - " + m.createdAt.toISOString() + " - " + m.author.username + " - " + m.cleanContent);
			}
			
			//if we got a full batch, try to get more
			if (messages.size == batchSize) {
				getMessages(channel, batchSize, messageId, date, getOldMessages);
			}
		})
		.catch(console.error);
}
