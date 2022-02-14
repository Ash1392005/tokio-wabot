let fetch = require('node-fetch')

let timeout = 120000
let poin = 500
let handler = async (m, { conn, usedPrefix }) => {
    conn.asahotak = conn.asahotak ? conn.brainteaser : {}
    let id = m.chat
    if (id in conn.brainteaser) {
        conn.reply(m.chat, 'There are still unanswered questions in this chat', conn.brainteaser[id][0])
        throw false
    }
    let res = await fetch(global.API('xteam', '/game/brainteaser', {}, 'APIKEY'))
    if (!res.ok) throw await res.text()
    let json = await res.json()
    if (!json.status) throw json
    let caption = `
${json.result.soal}

Timeout *${(timeout / 1000).toFixed(2)} detik*
Type ${usedPrefix}oo for help
Bonus: ${poin} XP
`.trim()
    conn.brainteaser[id] = [
        await conn.sendButton(m.chat, caption, author, 'Bantuan', '.ao', m),
        json, poin,
        setTimeout(async () => {
            if (conn.brainteaser[id]) await conn.sendButton(m.chat, `time has run out!\nThe answer *${json.result.answer}*`, author, 'falling', '.brainteaser', conn.brainteaser[id][0])
            delete conn.brainteaser[id]
        }, timeout)
    ]
}
handler.help = ['brainteaser']
handler.tags = ['game']
handler.command = /^answer/i

module.exports = handler
