const amqplib = require('amqplib')
const amqp_url_cloud =
  'amqps://hpjxxrbu:zgSONHtNXTN7qdZG-TE58oY51yJxJ0b6@armadillo.rmq.cloudamqp.com/hpjxxrbu'

const sendEmail = async () => {
  try {
    //1. create connection
    const connection = await amqplib.connect(amqp_url_cloud)
    //2. create channel
    const channel = await connection.createChannel()
    //3. create exchange
    const nameExchange = 'send_email'
    await channel.assertExchange(nameExchange, 'topic', { durable: false })

    const args = process.argv.slice(2)
    const msg = args[1] || 'Fixed!'
    const topic = args[0]

    console.log(`msg::: ${msg}::::topic:${topic}`)

    //4. publish email
    await channel.publish(nameExchange, topic, Buffer.from(msg))

    console.log(`[x] Send Ok::: ${msg}`)

    setTimeout(() => {
      connection.close()
      process.exit(0)
    }, 2000)
  } catch (error) {
    console.log(`Error::`, error.message)
  }
}

sendEmail()
