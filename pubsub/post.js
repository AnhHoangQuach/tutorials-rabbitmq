const amqplib = require('amqplib')
const amqp_url_cloud =
  'amqps://hpjxxrbu:zgSONHtNXTN7qdZG-TE58oY51yJxJ0b6@armadillo.rmq.cloudamqp.com/hpjxxrbu'

const postVideo = async ({ msg }) => {
  try {
    //1. create connection
    const connection = await amqplib.connect(amqp_url_cloud)
    //2. create channel
    const channel = await connection.createChannel()
    //3. create exchange
    const nameExchange = 'video'
    await channel.assertExchange(nameExchange, 'fanout', { durable: false })
    //4. publish video
    await channel.publish(nameExchange, '', Buffer.from(msg))

    console.log(`[x] Send Ok::: ${msg}`)

    setTimeout(() => {
      connection.close()
      process.exit(0)
    }, 2000)
  } catch (error) {
    console.log(`Error::`, error.message)
  }
}

const msg = process.argv.slice(2).join(' ') || 'Hello Exchange!'

postVideo({ msg })
