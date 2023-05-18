const amqplib = require('amqplib')
const amqp_url_cloud =
  'amqps://hpjxxrbu:zgSONHtNXTN7qdZG-TE58oY51yJxJ0b6@armadillo.rmq.cloudamqp.com/hpjxxrbu'

const receiveEmail = async () => {
  try {
    //1. create connection
    const connection = await amqplib.connect(amqp_url_cloud)
    //2. create channel
    const channel = await connection.createChannel()
    //3. create exchange
    const nameExchange = 'send_email'
    await channel.assertExchange(nameExchange, 'topic', { durable: false })

    //4. create queue
    const { queue } = await channel.assertQueue('', { exclusive: true })

    /*
        * co nghia la phu hop voi bat ky tu nao
        # khop voi mot hoac nhieu tu bat ky
    */

    //5. binding
    const args = process.argv.slice(2)
    if (!args.length) {
      process.exit(0)
    }

    console.log(`waiting queue ${queue}::: topic::${args}`)

    args.forEach(async (key) => {
      await channel.bindQueue(queue, nameExchange, key)
    })

    await channel.consume(queue, (msg) => {
      console.log(`Routing key:${msg.fields.routingKey}::: msg:::${msg.content.toString()}`)
    })
  } catch (error) {
    console.log(`Error::`, error.message)
  }
}

receiveEmail()
