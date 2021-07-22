const { Command } = require('discord.js-commando')
const libraries = require('../../libraries')
const { colors, EmbedGen } = libraries

module.exports = class invite extends Command {
  constructor (client) {
    super(client, {
      name: 'action',
      aliases: ['act','actions'],
      group: 'kingdoms',
      memberName: 'action',
      description: 'Do an action!',
      throttling: {
        usages: 2,
        duration: 10,
      },
      args: [{
        key: 'actType',
				prompt: '',
				type: 'string',
        default: ''
      }],
    })
  }

  run (message, { actType }) {
    const { db } = message.client
    const users = db.createModel('users')
    const kingdoms = db.createModel('kingdoms')
    const general = db.createModel('general')
    /*
		Once ported: Remove anything referencing temp variables that are part of my local environnement.
		Some variables are defined to match what they are in the repl.it hosting.
		My bot did not use PascalCase for EmbedGen, must be changed onee ported.
		
		Remember my bot names 'client' as bot
	
	*/
  const bot = this.client
	const msid = message.author.id
    if (actType.length === 0) return message.channel.send(EmbedGen(message.channel, false,[{name:'Unlocked actions:',value:'Repair|Build|xp'}],[message.author.username,message.author.avatarURL({ format: 'png', dynamic: true, size: 2048 })],false,'0x6718ce'))
	let lastUsed = (timedUsers[msid] - Date.now() + KINGDOM_EPOCH)/1000 || 0
    if (lastUsed > 0) return message.channel.send(`Sorry, this command is on cooldown. Please try again in ${Math.floor((timedUsers[msid]+KINGDOM_EPOCH-Date.now())/100)/10}`)

    const NOT_IN_CLAN = false;
	// resources and exp should be set according to real vars
    let resources = '//';
    let exp = 13
    let count = 5
	let bonus = ''
	if (lastUsed <= -900) count=10, bonus=' [15 mins+ bonus]'
	if (lastUsed <= -3600) count=15, bonus=' [hourly x3]'
	if (lastUsed <= -3600*12) count=20, bonus=' [12 hours+ bonus]'
	if (lastUsed <= -3600*24) count=Math.floor( 25*(1+lastUsed/(-3600*24))**0.5 ), bonus=' [long offline inactivity]'
	//if (somehow check if this is the first time of the day) count+=25, bonus +='[+5x first time of the day]' 
	let r = [false, false, false]
    switch (actType){
		case "xp":
		case "exp":
		case "experience":
			r = acting('xp', count, exp, NOT_IN_CLAN)
		break;
		case "build":
			r = acting('build', count, exp, NOT_IN_CLAN)
		break;
		case "repair":
		case "rep":
		case "heal":
		case "he":
			r = acting('repair', count, exp, NOT_IN_CLAN)
		break;
		
		default:
		break;
		
		
	}
	if (r[0]) timedUsers[msid] = Date.now()-KINGDOM_EPOCH+30000
	if (r[0] == false && r[1] == false && r[2] == false) return message.channel.send(EmbedGen(message.channel, `Invalid Action`,false,[message.author.username,message.author.avatarURL({ format: 'png', dynamic: true, size: 2048 })],[`${bot.user.tag}`, bot.user.avatarURL({ format: 'png', dynamic: true, size: 2048 })],'0x6718ce'))
	
	message.channel.send(EmbedGen(message.channel, r[1], r[2], [message.author.tag, message.author.avatarURL({ format: 'png', dynamic: true, size: 2048 })], [`${bot.user.tag}`, bot.user.avatarURL({ format: 'png', dynamic: true, size: 2048 })], '0x6718ce',false,`Multiplier: x${count/5}${bonus}`,Date.now()))
  }
}

const KINGDOM_EPOCH = 1624385650000
let timedUsers = {}

function acting (actType, count, exp, NOT_IN_CLAN){
	// Return:  [worked?, `title`, fields
	let knownLevel = 1
	let alreadyxp = 10
	let r = [false, false, false]
  switch (actType){
  	case 'xp':
	case 'exp':
	case 'experience':
	  // TOADD:  push +count xp in the user database
	  if (NOT_IN_CLAN) r = [true, `SOLO GAIN EXP`, [{name:'You got ',value:`${count} xp!\n` + showLevel(alreadyxp + count, knownLevel)}] ]
	  else {
		  r = [true, `GAIN EXP`, [{name:'You got ',value:`${count} xp! Your guild got ${count*3} xp!\n` + showLevel(alreadyxp + count, knownLevel, false)}] ]
	  }
	break;
	case 'build':
	  if (NOT_IN_CLAN) r = [false, false, [{name:'Invalid Action',value:'Please join a kingdom first!'}] ]
	  else {
		  let gainXp = Math.floor(count*0.6)
		  r = [true, `Build`, [{name:'Build Status:',value:`Build index is now ${count*5}!\nYou spent ${count}\\🧱` + showLevel(alreadyxp + gainXp, knownLevel, true)}] ]
	  }
	break;
	case 'rep':
	case 'repair':
	case 'heal':
	case 'he':
	  if (NOT_IN_CLAN) r = [false, false, [{name:'Invalid Action',value:'You can not repair a kingdom if you are not in one!'}] ]
	  else {
		  let gainXp = Math.floor(count*0.6)
		  r = [true, `Repair`, [{name:'Repair Status:',value:`Your guild is now at ${24500+count*5}💖` + showLevel(alreadyxp + gainXp, knownLevel, true)}] ]
	  }
	break;
	default:
	break;
		
	}
	return r;
	
	
}

function showLevel (xp, knownLevel, onlyLevelUp) {
  const curLevel = Math.floor((0.1 * xp)**0.5);

  let diffXP = (knownLevel**2)*10
  let maxXP = (((knownLevel+1)**2)*10-diffXP)
  let realXP = (xp-diffXP)
  let QTT = realXP/maxXP
  // You need '+(maxXP-realXP)+ ' more xp to go to the next level.
  let txt = `You are level ${curLevel} [`
  txt += ''.padEnd(Math.floor(5*(Math.min(realXP/maxXP,1))), '◬')
  txt += ''.padEnd(Math.ceil(5*(Math.min(1 - realXP/maxXP,1))), '◷')
  txt += `] ${realXP}/${maxXP}`

	if (onlyLevelUp) txt = ``
    if(knownLevel < curLevel) txt += `\n**LEVEL UP!** You are now level **${curLevel}**`
	return txt
	// /!\ This function must become ABLE to push the new known curLevel after declaring it
	// It can happen the player get to a new level w/o being informed. He would only be informed once showLevel () is run!
}