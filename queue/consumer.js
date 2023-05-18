const amqplib = require('amqplib')
const amqp_url_cloud = ''
const amqp_url_docker = 'amqp://localhost:5672'

const receiveQueue = async () => {
  try {
    //1. create connection
    const connection = await amqplib.connect(amqp_url_docker)
    //2. create channel
    const channel = await connection.createChannel()
    //3. create name queue
    const nameQueue = 'q1'
    //4. create queue
    await channel.assertQueue(nameQueue, { durable: true })
    //5. receive to queue
    await channel.consume(
      nameQueue,
      (msg) => {
        console.log(`Message: ${msg.content.toString()}`)
      },
      {
        noAck: true, // if true, message will be deleted after received
      }
    )
    //6. close connection and channel
  } catch (error) {
    console.log(`Error::`, error.message)
  }
}

receiveQueue()
