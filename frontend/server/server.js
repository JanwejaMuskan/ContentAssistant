const express = require('express');
const axios = require('axios'); // Use axios instead of node-fetch
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(cors());

app.post('/forward-to-slack', async (req, res) => {
  const { message } = req.body;
  const slackWebhookUrl = 'https://hooks.slack.com/services/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'; // Replace with your Slack webhook URL

  try {
    const response = await axios.post(slackWebhookUrl, { text: message });

    if (response.status === 200) {
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ success: false, error: 'Failed to send message to Slack' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error sending message to Slack' });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
