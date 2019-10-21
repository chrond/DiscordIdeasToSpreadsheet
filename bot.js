require( 'dotenv' ).config();
const ComfyDiscord = require( 'comfydiscord' );
const fs = require('fs');
const csvFileName = 'idears.csv';
const endOfLine = require('os').EOL;

ComfyDiscord.onCommand = ( channelName, user, command, msg, flags, extra ) => {
  if ( command.toLowerCase() === 'getoldidears' ) {
    if (channelName == process.env.IDEARCHANNEL) {
      let batchSize = 10;
      let earliestMessageId = '';
      let earliestDate = new Date(3000, 1);
      getMessages(extra.channel, batchSize, earliestMessageId, earliestDate, true);
    }
  }
  else if ( command.toLowerCase() === 'getnewidears' ) {
    if (channelName == process.env.IDEARCHANNEL) {
      let batchSize = 10;
      let newestMessageId = '';
      let newestDate = new Date(1990, 1);
      getMessages(extra.channel, batchSize, newestMessageId, newestDate, false);
    }
  }
  else {
    //Looks like a command but should be treated as a regular comment
    if (channelName == process.env.IDEARCHANNEL) {
      writeToFile( extra.id, new Date(), user, '!' + command + ' ' + extra.cleanContent );
    }
  }
}
ComfyDiscord.onChat = ( channelName, user, msg, flags, extra ) => {
  if (channelName == process.env.IDEARCHANNEL) {
    writeToFile( extra.id, new Date(), user, extra.cleanContent );
  }
}
ComfyDiscord.Init( process.env.DISCORDTOKEN );

function getMessages( channel, batchSize, messageId, date, getOldMessages ) {
  let options = { limit: batchSize };
  
  if (getOldMessages && messageId != '') {
    options.before = messageId;
  }
  else if (!getOldMessages && messageId != '') {
    options.after = messageId;
  }

  // Get the next batch of messages
  channel.fetchMessages(options)
    .then( messages => {
      //console.log('Received ' + messages.size + ' messages.');
      
      for (let m of messages.values()) {
        if ( messageId == "" || (getOldMessages && m.createdAt <= date) || (!getOldMessages && m.createdAt > date) ) {
          messageId = m.id;
          date = m.createdAt;
        }
        writeToFile( m.id, m.createdAt, m.author.username, m.cleanContent );
      }
      
      //if we got a full batch, try to get more
      if (messages.size == batchSize) {
        getMessages( channel, batchSize, messageId, date, getOldMessages );
      }
    })
    .catch(console.error);
}

function writeToFile( id, date, user, messageText ) {
  //flag 'as': Open file for appending in synchronous mode. The file is created if it does not exist.
  fs.writeFileSync(csvFileName, id + ',' + date.toISOString() + ',' + csvTextEscape(user) + ',' + csvTextEscape( messageText ) + endOfLine, { encoding: 'utf8', flag: 'as' } )
}

function csvTextEscape( str ) {
  return `"` + str.replace(/"/g, `""`).replace(/(?:\r\n|\r|\n)/g, ' ') + `"`;
}