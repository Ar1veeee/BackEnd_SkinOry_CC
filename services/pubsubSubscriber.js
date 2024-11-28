"use strict";
const nodemailer = require("nodemailer");
const { User } = require("../models/userModel");
const pubsub = require("../config/googleCloud");
const Routine = require("../models/routineModel");
const subscriptionDay = "day-routine-deleted-topic-sub";
const subscriptionNight = "night-routine-deleted-topic-sub";
require("dotenv").config();

async function sendEmail(user, subject, routines, action) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const userName = user.username ? user.username : "Valued Customer";

  const routineListHtml = routines
    .map(
      (routine) =>
        `<li><strong>${routine.product_name}</strong> (${routine.category})</li>`
    )
    .join("");

  const htmlContent = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 8px;
          }
          .header {
            background-color: #ff0303;
            color: white;
            padding: 15px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .content {
            padding: 20px;
            background-color: white;
            border-radius: 0 0 8px 8px;
          }
          .product-list {
            list-style-type: none;
            padding: 0;
          }
          .product-list li {
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f7f7f7;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: 20px;
          }
          .footer a {
            color: #4CAF50;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Your ${action} Routine Has Been Deleted</h2>
          </div>
          <div class="content">
            <p>Dear ${userName},</p>
            <p>Your ${action.toLowerCase()} routine has been successfully deleted. Below are the details of the routine that was removed:</p>
            <ul class="product-list">
              ${routineListHtml}
            </ul>
            <p>If you need further assistance or have any questions, feel free to <a href="mailto:aliefarifin99@gmail.com">contact us</a>.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Skinory. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: `"Skinory Service" <${process.env.EMAIL}>`,
    to: user.email,
    subject: subject,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
}

async function listenForMessages() {
  const daySubscription = pubsub.subscription(subscriptionDay);
  const nightSubscription = pubsub.subscription(subscriptionNight);

  const messageHandler = async (message) => {
    try {
      const data = JSON.parse(message.data.toString());
      console.log("Received data:", data);

      const user = await User.findUserById(data.user_id);

      if (!user) {
        console.error(`User not found: ${data.user_id}`);
        message.nack();
        return;
      }

      let routineDetails = data.routines; // Gunakan langsung dari Pub/Sub jika tersedia
      let action;

      if (data.action === "deleted_day_routine") {
        action = "Day";
        // Jika data tidak ada, fallback ke database
        if (!routineDetails || routineDetails.length === 0) {
          routineDetails = await Routine.getDayRoutinesByUserId(data.user_id);
        }
        await Routine.deleteDayRoutinesByUserId(data.user_id); // Hapus di database
      } else if (data.action === "deleted_night_routine") {
        action = "Night";
        if (!routineDetails || routineDetails.length === 0) {
          routineDetails = await Routine.getNightRoutinesByUserId(data.user_id);
        }
        await Routine.deleteNightRoutinesByUserId(data.user_id); // Hapus di database
      } else {
        console.warn(`Unhandled action type: ${data.action}`);
        message.ack();
        return;
      }

      if (!routineDetails || routineDetails.length === 0) {
        console.warn(`No routines found for user: ${data.user_id}`);
        message.ack();
        return;
      }

      await sendEmail(
        user,
        `Your ${action} Routine Has Been Deleted`,
        routineDetails,
        action
      );

      message.ack();
    } catch (error) {
      console.error("Error handling Pub/Sub message:", error);
      message.nack();
    }
  };

  daySubscription.on("message", messageHandler);
  nightSubscription.on("message", messageHandler);
}

module.exports = { listenForMessages };
