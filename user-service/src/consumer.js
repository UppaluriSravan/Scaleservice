// consumer.js: Consumes user_registered messages from RabbitMQ
const amqp = require("amqplib");

async function startConsumer() {
  try {
    const conn = await amqp.connect("amqp://rabbitmq:5672");
    const channel = await conn.createChannel();
    const queue = "user_registered";
    await channel.assertQueue(queue, {durable: false});
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const user = JSON.parse(msg.content.toString());
        console.log(" [x] Received user registration:", user);
        // Here you can trigger sending an email, etc.
        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error("RabbitMQ consumer error:", err.message);
    setTimeout(startConsumer, 5000); // Retry after 5 seconds if connection fails
  }
}

startConsumer();
