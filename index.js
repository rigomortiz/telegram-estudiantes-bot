require('dotenv').config()
const express = require('express')
const axios = require('axios')
const crypto = require("crypto")

const { PORT, API_KEY, SERVER_URL, SECRET_MD5, GOOGLE_FORMS, GROUP_TELEGRAM_LINK } = process.env

// app initialization
const app = express()

// middlewares
app.use(express.json())

// Telegram API Configuration
const TELEGRAM_API = `https://api.telegram.org/bot${API_KEY}`
const URI = `/webhook/${API_KEY}`
const webhookURL = `${SERVER_URL}${URI}`

// configuring the bot via Telegram API to use our route below as webhook
const setupWebhook = async () => {
    try {
        const { data } = await axios.get(`${TELEGRAM_API}/setWebhook?url=${webhookURL}&drop_pending_updates=true`)
        console.log(`setupWebhook:`, data)
    } catch (error) {
        console.log(`Error:`, error)
        return error
    }
}

app.get('/', (req, res) => {
    res.send('Hello World!')
    console.log('Hello World!')
})


app.listen(PORT, async () => {
    // setting up our webhook url on server start
    try {
        console.log(`Server is up and Running at PORT : ${PORT}`)
        await setupWebhook()
    } catch (error) {
        console.log(error.message)
    }
})

app.post(URI,  async (req, res) => {
    try {
        const {message} = req.body

        if (message.chat.type !== 'private')
            return res.status(200).send('ok')

        const username = message.from.username || ''

        // console.log(`message:`, message)
        // console.log(`Message from ${username}: ${message.text}`)

        if (message.text === '/start') {
            // Typing chat action
            await axios.post(`${TELEGRAM_API}/sendChatAction`, {
                chat_id: message.chat.id,
                action: 'typing'
            })

            // Sleep for 2 seconds
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Send message
            await axios.post(`${TELEGRAM_API}/sendMessage`, {
                chat_id: message.chat.id,
                text: `¡Hola ${username}!
                \n1. Para ingresar al grupo escribe:\n /ingresar
                \n2. Para validar que cuentas con un correo ciencias.unam.mx escribe:\n /validar`
            })
        } else if(message.text === '/ingresar') {
            // Typing chat action
            await axios.post(`${TELEGRAM_API}/sendChatAction`, {
                chat_id: message.chat.id,
                action: 'typing'
            })
            // MD5 Hash
            //const MD5 = crypto.createHmac("md5", SECRET_MD5).update(message.from.id.toString()).digest("hex")
            // Sleep for 2 seconds
            await new Promise(resolve => setTimeout(resolve, 2000))
            // Send message
            await axios.post(`${TELEGRAM_API}/sendMessage`, {
                chat_id: message.chat.id,
                text: `Para ingresar al grupo es necesario que cuentes con correo ciencias.unam.mx
                \n1. Ingresa al siguiente link del grupo de telegram: ${GROUP_TELEGRAM_LINK}
                \n2. Llena el siguiente formulario: ${GOOGLE_FORMS + message.from.id}
                \n3. Al finalizar el formulario, espera a que el bot apruebe tu solicitud.
                \n4. Si no te aprueban, es porque no cuentas con correo @ciencias, por lo que no puedes ingresar al grupo.
                \n
                \nSi tienes problemas para ingresar envía un mensaje a @rigomortiz.`
            })
        }  else if(message.text === '/validar') {
            // Typing chat action
            await axios.post(`${TELEGRAM_API}/sendChatAction`, {
                chat_id: message.chat.id,
                action: 'typing'
            })
            // MD5 Hash
            //const MD5 = crypto.createHmac("md5", SECRET_MD5).update(message.from.id.toString()).digest("hex")
            // Sleep for 2 seconds
            await new Promise(resolve => setTimeout(resolve, 2000))
            // Send message
            await axios.post(`${TELEGRAM_API}/sendMessage`, {
                chat_id: message.chat.id,
                text: `Para validar tu usuario es necesario que cuentes con correo ciencias.unam.mx
                \n1. Llena el siguiente formulario: ${GOOGLE_FORMS + message.from.id}
                \n2. Al finalizar el formulario, espera a que el bot valide tu correo.
                \n
                \nSi tienes problemas para validar envía un mensaje a @rigomortiz.`
            })
        }

        res.status(200).send('ok');
    } catch (error) {
        console.log(error.message)
    }
})
