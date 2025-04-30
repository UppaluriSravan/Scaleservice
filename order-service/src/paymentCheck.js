// paymentCheck.js: Consumes payment_approved messages from RabbitMQ and updates order status
const amqp = require("amqplib");
const mongoose = require("mongoose");
const Order = require("./models/order");
require("dotenv").config();

async function startConsumer() {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    const conn = await amqp.connect("amqp://rabbitmq:5672");
    const channel = await conn.createChannel();
    const queue = "payment_approved";
    await channel.assertQueue(queue, {durable: false});
    console.log(
      " [*] Waiting for payment approvals in %s. To exit press CTRL+C",
      queue
    );
    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const {orderId} = JSON.parse(msg.content.toString());
        console.log(" [x] Payment approved for order:", orderId);
        // Update order status to completed
        await Order.findByIdAndUpdate(orderId, {status: "completed"});
        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error("RabbitMQ consumer error:", err.message);
    setTimeout(startConsumer, 5000); // Retry after 5 seconds if connection fails
  }
}

startConsumer();
