const { join } = require('path')

// =-=-=-=-=-=-=
// Discord oauth
// =-=-=-=-=-=-=
const express = require('express')
const cookieParser = require('cookie-parser')
const { catchAsync } = require('./utils')

// Get database
const { bot } = require('../../../bot')
const { sessions } = bot.db

// Express router
const router = express.Router()
router.use(cookieParser())

// Functions
function getRandomString (length) {
  const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length))
  }
  return result
}
function getAppCookies (req) {
  const rawCookies = req.headers.cookie.split('; ')
  const parsedCookies = {}
  rawCookies.forEach(rawCookie => {
    const parsedCookie = rawCookie.split('=')
    parsedCookies[parsedCookie[0]] = parsedCookie[1]
  })
  return parsedCookies
}

// Oauth Client
const redirect = 'https://kingdoms.reals.tech/api/discord/callback'
const CLIENT_ID = '690523362199470090'
const CLIENT_SECRET = 'chLyxxWQJaJHn5YlHb4qvmckI24EouIx'

const DiscordOauth2 = require('discord-oauth2')
const oauth = new DiscordOauth2()
const Client = require('discord-oauth2-api')
const client = new Client({
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  scopes: ['identify', 'guilds', 'guilds.join'],
  redirectURI: redirect
})

router.get('/login', (req, res) => {
  res.sendFile(join(__dirname, '../../frontend/loginstart.html'))
})

router.get('/start', (req, res) => {
  if (req.cookies.sid) {
    res.redirect('/dashboard')
    return
  }
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=guilds.join%20guilds%20identify&response_type=code&redirect_uri=${redirect}`)
})

router.get('/callback', catchAsync(async (req, res) => {
  if (!req.query.code) return res.redirect('/')
  const code = req.query.code
  oauth.tokenRequest({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,

    code: code,
    scope: ['identify', 'guilds', 'guilds.join'],
    grantType: 'authorization_code',

    redirectUri: redirect
  }).then(access_token => {
    res.redirect(`/api/discord/process/?token=${access_token.access_token}`)
  })
}))

router.get('/process', catchAsync(async (req, res) => {
  if (!req.query.token) return res.send('No token provided.')
  if (req.cookies.sid) return res.redirect('/dashboard')
  const token = req.query.token
  client.getUser(token).then(user => createsid(user.tag, user.id, res, user, req, token)).catch((e) => {
    return res.send('Invalid token.')
  })
}))

router.get('/askToJoin', catchAsync(async (req, res) => {
  if (!req.query.token) return res.send('No token provided.')
  if (!req.query.id) return res.send('No id provided.')
  if (req.cookies.sid) return res.redirect('/dashboard')
  const token = req.query.token
  res.sendFile(join(__dirname, '../../frontend/askToJoin.html'))
}))

router.post('/confirmJoin', function (req, res) {
  if (!req.query.token) return res.json({ responseCode: 3 })
  if (!req.query.id) return res.json({ responseCode: 4 })
  if (req.cookies.sid) {
    res.json({ responseCode: 5 })
    return
  }
  const token = req.query.token
  const id = req.query.id
  oauth.addMember({
    accessToken: token,
    botToken: 'NjkwNTIzMzYyMTk5NDcwMDkw.XnSp_g.yn9gwtnp2oFazL-qgcCUy6PDW-M',
    guildId: '528602970569441282',
    userId: id
  }).then((result) => {
    res.json({ responseCode: 1 })
  }).catch((e) => {
    res.json({ responseCode: 6 })
    console.log(e)
  })
})

function createsid (tag, id, res, user, req, token) {
  if (req.cookies.sid) return res.redirect('/dashboard')
  // if(id!="472327239661518848") return res.send("You are not allowed to login. This is not a bug / error.")
  client.getGuilds(token).then(async guilds => {
    // console.log(guilds)
    let allowed = false
    for (let i = 0; i < guilds.length; i++) {
      // console.log('Debug: '+guilds[i].id + " Needed: 528602970569441282")
      if (guilds[i].id === '528602970569441282') allowed = true
    }
    if (!allowed) {
      res.redirect(`/api/discord/askToJoin/?token=${token}&id=${id}`)
    } else {
      const userip = req.headers['x-forwarded-for'].split(', ')[0]
      const presid = getRandomString(40)
      const sid = `kingdoms_secure_${presid}`
      console.log('✅ [Website] New user logged in! Info below:')
      console.log(user)
      await sessions.set(`${sid}.id`, id)
      await sessions.set(`${sid}.token`, token)
      res.cookie('sid', sid)
      if (req.cookies.joinCode) {
        const joinCode = getAppCookies(req).joinCode
        return res.redirect(`/join/${joinCode}`)
      }
      res.redirect('/dashboard')
    }
  })
  /*
  var userip = req.headers["x-forwarded-for"].split(", ")[0]
  var presid = getRandomString(40)
  var sid = "kingdoms_secure_" + presid
  console.log('[Dashboard] New user logged in! Info below:')
  console.log(user)
  res.cookie('sid', sid)
  sessions.set(sid + '.id', id)
  userinfo.set(id + '.tag', tag)
  userinfo.set(id + '.name', user.username)
  userinfo.set(id + '.hashtag', user.discriminator)
  userinfo.set(id + '.avatar', user.avatar)
  prelogin.set(pid+'.usertag', tag)
  res.sendFile(__dirname + "/logindone.html");
  */
}

module.exports = router
