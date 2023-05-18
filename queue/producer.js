const amqplib = require('amqplib')
const amqp_url_cloud = ''
const amqp_url_docker = 'amqp://localhost:5672'

const sendQueue = async ({ msg }) => {
  try {
    //1. create connection
    const connection = await amqplib.connect(amqp_url_docker)
    //2. create channel
    const channel = await connection.createChannel()
    //3. create name queue
    const nameQueue = 'q1'
    //4. create queue
    await channel.assertQueue(nameQueue, { durable: true })
    //5. send to queue
    await channel.sendToQueue(nameQueue, Buffer.from(msg), {
      //   expiration: '10000',
      persistent: true, // if true, message will be saved to disk
    })
    //6. close connection and channel
  } catch (error) {
    console.log(`Error::`, error.message)
  }
}

const msg = process.argv.slice(2).join(' ') || 'Hello World'
sendQueue({ msg })
