const { join } = require('path')

// =-=-=-=-=-=
// Website
// =-=-=-=-=-=

const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
app.use(cookieParser())
const { db, general, sessions, users, kingdoms } = require('../../db')
const { bot } = require('../../client')

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
async function createLink (kingdom) {
  const link = await kingdoms.get(`${kingdom}.link`)
  if (link) {
    await kingdoms.delete(`${kingdom}.link`)
    await kingdoms.delete(`${kingdom}.linkuses`)
  }
  const newLink = getRandomString(8)
  await kingdoms.set(`${kingdom}.link`, newLink)
  await kingdoms.set(`${kingdom}.linkuses`, 0)
  console.log(`✅ [Website] Created a new link for kingdom ${kingdom} link ${newLink}`)
}
async function addUserToKingdom (user, kingdom, res) {
  // return res.send('WIP - need bot client')
  // Give user role
  const server = bot.guilds.cache.get('528602970569441282')
  const categoryId = await kingdoms.get(`${kingdom}.category`)
  const role = server.roles.cache.find(r => r.name === `${kingdom} ≼🔅Member≽`)
  const member = await server.members.fetch(user)
  member.roles.add(role)
  // Announce user joining on channel
  const channel = server.channels.cache.find(c => c.name.includes('main') && c.parentID === categoryId && c.type === 'text')
  const name = await kingdoms.get(`${kingdom}.name`)
  const count = await kingdoms.get(`${kingdom}.members`)
  const c = count.length + 1
  channel.send(`:wave: Everyone, welcome <@${user}>, as he/she is the newest member of our Kingdom, **${name}**! We are now at **${c}** member(s).`)
  console.log(`✅ [Bot] User with ID: ${user} joined the kingdom with ID: ${kingdom}`)
  // Save to DB
  await users.set(`${user}.kingdom`, kingdom)
  await users.set(`${user}.role`, 1)
  await kingdoms.push(`${kingdom}.members`, user)
  await kingdoms.add(`${kingdom}.linkuses`, 1)
  res.render(join(__dirname, '../frontend/joinAnim.ejs'), { name: name, channel: channel.id })
}

// Oauth Clients
const redirect = 'https://kingdoms.reals.tech/api/discord/callback'
const CLIENT_ID = '690523362199470090'
const CLIENT_SECRET = 'chLyxxWQJaJHn5YlHb4qvmckI24EouIx'
const Client = require('discord-oauth2-api')
const client = new Client({
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  scopes: ['identify', 'guilds', 'guilds.join'],
  redirectURI: redirect
})

// Main page
app.get('/', (req, res) => {
  res.status(200)
  res.sendFile(join(__dirname, '../frontend/index.html'))
})

// Discord invite
app.get('/discord', (req, res) => {
  res.redirect('https://discord.gg/MwFPXCM')
})

// Join invite links
app.get('/join/:code', async (req, res) => {
  const code = req.params.code
  if (code === 'joined') {
    return res.sendFile(join(__dirname, '../frontend/joined.html'))
  }
  const allKingdoms = await general.get('kingdoms')
  let found = false
  for (const kingdom of allKingdoms) {
    var kingdomInfo = await kingdoms.get(kingdom)
    if (kingdomInfo.link === code) found = kingdom
  }
  if (found === false) {
    return res.sendFile(join(__dirname, '../frontend/invalidLink.html'))
  }
  res.status(200)
  if (req.cookies.sid) {
    res.clearCookie('joinCode')
    const sid = getAppCookies(req).sid
    const token = await sessions.get(`${sid}.token`).catch((e) => { res.send('error here') })
    const id = await sessions.get(`${sid}.id`).catch((e) => { res.send('error here') })
    if (!token) return res.redirect('/logout')
    client.getUser(token).then(async (user) => {
      const kingdom = await users.get(`${id}.kingdom`)
      if (kingdom) {
        var userInfo = await users.get(id)
        var kingdomInfo = await kingdoms.get(userInfo.kingdom)
        if (userInfo.kingdom === found) {
          return res.redirect('/dashboard?alreadyOnThisKingdom')
        }
        const invitedKingdomInfo = await kingdoms.get(found)
        return res.render(join(__dirname, '../frontend/alrKingdom.ejs'), { tag: user.tag, name: kingdomInfo.name, currentName: invitedKingdomInfo.name })
      } else {
        if (req.query.confirm === 'yes') {
          addUserToKingdom(id, found, res)
          // var client = await general.get('client')
          // res.send(client.user.tag)
        } else {
          var userInfo = await users.get(id)
          var kingdomInfo = await kingdoms.get(found)
          return res.render(join(__dirname, '../frontend/confirmJoin.ejs'), { tag: user.tag, name: kingdomInfo.name })
        }
      }
    }).catch((e) => {
      console.log(`❌ [Website] Session ID ${sid} has a token ${token} that threw this error and was logged out! ${e}`)
      res.redirect('/logout')
    })
  } else {
    res.cookie('joinCode', code)
    var kingdomInfo = await kingdoms.get(found)
    res.render(join(__dirname, '../frontend/askLogin.ejs'), { name: kingdomInfo.name })
  }
})

// Dashboard
app.get('/resetLink', async (req, res) => {
  if (req.cookies.sid) {
    const sid = getAppCookies(req).sid
    const token = await sessions.get(`${sid}.token`).catch((e) => { res.send('error here') })
    const id = await sessions.get(`${sid}.id`).catch((e) => { res.send('error here') })
    if (!token) return res.redirect('/logout')
    client.getUser(token).then(async (user) => {
      const kingdom = await users.get(`${id}.kingdom`)
      if (kingdom) {
        const userInfo = await users.get(id)
        const kingdomInfo = await kingdoms.get(userInfo.kingdom)
        const role = userInfo.role
        let role2
        if (role === 1) role2 = 'Member'
        if (role === 2) role2 = 'Royal Guard'
        if (role === 3) role2 = 'King'
        if (userInfo.role === 3) {
          createLink(kingdom)
          res.redirect('/dashboard')
        } else {
          res.send('No permission.')
        }
      } else {
        res.send('No Kingdom.')
      }
    }).catch((e) => {
      console.log(`❌ [Website] Session ID ${sid} has a token ${token} that threw this error and was logged out! ${e}`)
      res.redirect('/logout')
    })
  } else {
    res.redirect('/api/discord/login')
  }
})

// Dashboard
app.get('/dashboard', async (req, res) => {
  if (req.cookies.sid) {
    const sid = getAppCookies(req).sid
    const token = await sessions.get(`${sid}.token`).catch((e) => { res.send('error here') })
    const id = await sessions.get(`${sid}.id`).catch((e) => { res.send('error here') })
    if (!token) return res.redirect('/logout')
    client.getUser(token).then(async (user) => {
      const kingdom = await users.get(`${id}.kingdom`)
      if (kingdom) {
        const userInfo = await users.get(id)
        const kingdomInfo = await kingdoms.get(userInfo.kingdom)
        const role = userInfo.role
        let role2
        if (role === 1) role2 = 'Member'
        if (role === 2) role2 = 'Royal Guard'
        if (role === 3) role2 = 'King'
        if (userInfo.role === 3) {
          const info = await kingdoms.get(`${kingdom}.link`)
          if (!info) {
            createLink(kingdom)
            return res.redirect('/dashboard')
          }
          console.log('a')
          var kingdomHtml = `<b>[Kingdom Info] Name: </b>${kingdomInfo.name} <b>Members: </b>${kingdomInfo.members.length} <b>Your role: </b>${role2}<br><b>[Invite Link] Link: </b><a href="https://kingdoms.reals.tech/join/${kingdomInfo.link}/">https://kingdoms.reals.tech/join/${kingdomInfo.link}/</a><b> Link uses: </b>${kingdomInfo.linkuses} <b>Available actions:</b> <a href="/resetLink">Reset link</a>`
        } else {
          console.log('b')
          var kingdomHtml = `<b>[Kingdom Info] Name: </b>${kingdomInfo.name} <b>Members: </b>${kingdomInfo.members.length} <b>Your role: </b>${role2}`
        }
      } else {
        var kingdomHtml = '<b>[Kingdom Info]</b> You are not in a kingdom! Join one by using a link, or create your own.'
      }
      res.send(`Welcome to the temp dashboard! <br><b>[User Info] Tag: </b>${user.tag} <b>ID: </b>${id}<b> Available actions:</b> <a href="/logout">Logout</a> <br>${kingdomHtml}`)
      console.log(`✅ [Website] Session ID ${sid} with token ${token} accessed the Dashboard.`)
    }).catch((e) => {
      console.log(`❌ [Website] Session ID ${sid} has a token ${token} that threw this error and was logged out! ${e}`)
      res.redirect('/logout')
    })
  } else {
    res.redirect('/api/discord/login')
  }
})

app.get('/logout', async (req, res) => {
  if (req.cookies.sid) {
    const sid = getAppCookies(req).sid
    const token = await sessions.get(`${sid}.token`).catch((e) => { res.send('error here') })
    if (token) {
      await sessions.delete(token)
    }
    res.clearCookie('sid')
    console.log(`✅ [Website] Session ID ${sid} with token ${token} logged out.`)
    res.redirect('/')
  } else {
    res.redirect('/')
  }
})

// Assets
app.use('/assets/css', express.static(join(__dirname, '../frontend/css')))
app.use('/assets/js', express.static(join(__dirname, '../frontend/js')))
app.use('/assets/img', express.static(join(__dirname, '../frontend/img')))

// Oauth
app.use('/api/discord', require('./api/discord'))

// 500 Page
app.use(function (err, req, res, next) {
  console.log(`❌ [Website] Internal error for url ${req.url} Error: ${err}`)
  res.status(err.status || 500).sendFile(join(__dirname, '../frontend/500.html'))
})

// 404 Page
app.get('*', (req, res) => {
  console.log(`❌ [Website] Page not found for url ${req.url}`)
  res.status(404).sendFile(join(__dirname, '../frontend/404.html'))
})
// Start webserver
app.listen(3000, () => console.log('✅ [Website] Website started on port 3000.'))
