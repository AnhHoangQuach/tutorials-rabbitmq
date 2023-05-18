const amqplib = require('amqplib')
const amqp_url_cloud =
  'amqps://hpjxxrbu:zgSONHtNXTN7qdZG-TE58oY51yJxJ0b6@armadillo.rmq.cloudamqp.com/hpjxxrbu'

const receiveNoti = async () => {
  try {
    //1. create connection
    const connection = await amqplib.connect(amqp_url_cloud)
    //2. create channel
    const channel = await connection.createChannel()
    //3. create exchange
    const nameExchange = 'video'
    await channel.assertExchange(nameExchange, 'fanout', { durable: false })
    //4. create queue

    const { queue } = await channel.assertQueue('', {
      exclusive: true, // if true, queue will be deleted after connection close
    })

    console.log(`nameQueue::: ${queue}`)

    //5. binding queue to exchange ( moi quan he giua exchange va queue)
    await channel.bindQueue(queue, nameExchange, '')

    //6. consume message
    await channel.consume(
      queue,
      (msg) => {
        console.log(`Message: ${msg.content.toString()}`)
      },
      {
        noAck: true, // if true, message will be deleted after received
      }
    )
  } catch (error) {
    console.log(`Error::`, error.message)
  }
}

receiveNoti()
