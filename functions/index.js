const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// https://medium.com/evenbit/building-a-slack-app-with-firebase-as-a-backend-151c1c98641d

// Deploy
// Im Teminal: firebase deploy --only functions

exports.command_buzz_news = functions.https.onRequest(
  async (request, response) => {
    if (request.method !== "POST") {
      console.error(
        `Got unsupported ${request.method} request. Expected POST.`
      );
      return response.send(405, "Only POST requests are accepted");
    }

    if (request.body.token !== functions.config().slack.token) {
      return response.send(401, "Invalid request token!");
    }

    // Handle the commands later, Slack expect this request to return within 3000ms
    await admin
      .database()
      .ref("news")
      .push({
        user: request.body.user_name,
        message: request.body.text,
        timestamp: new Date().getTime()
      });

    return response
      .status(200)
      .send("Thank you! 🚀 News will go live on BuzzBoard in a few seconds.");
  }
);
