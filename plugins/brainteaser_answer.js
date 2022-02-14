const similarity = require('similarity')
const threshold = 0.72
module.exports = {
    async before(m) {
        let id = m.chat
        if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/Ketik.*ao/i.test(m.quoted.contentText)) return !0
        this.brainteaser = this.brainteaser ? this.brainteaser : {}
        if (!(id in this.asahotak)) return m.reply('The matter has ended')
        if (m.quoted.id == this.brainteaser[id][0].id) {
            let json = JSON.parse(JSON.stringify(this.brainteaser[id][1]))
            if (['.ao', 'help', ''].includes(m.text)) return !0
            if (m.text.toLowerCase() == json.result.answer.toLowerCase().trim()) {
                global.db.data.users[m.sender].exp += this.brainteaser[id][2]
                await this.sendButton(m.chat, `*bingo!* +${this.brainteaser[id][2]} XP`, author, 'falling', '.brainteaser', m)
                clearTimeout(this.brainteaser[id][3])
                delete this.brainteaser[id]
            } else if (similarity(m.text.toLowerCase(), json.result.answer.toLowerCase().trim()) >= threshold) m.reply(`*a little more!*`)
            else m.reply(`*wrong*`)
        }
        return !0
    },
    exp: 0
}
