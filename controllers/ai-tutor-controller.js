require('dotenv').config();
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const axios = require('axios');
// const stream = require('stream');

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

// Function to fetch video and transcript
const fetchVideoAndTranscript = async (videoName) => {
    const videoParams = { Bucket:'ai-tutor-videos', Key: `${videoName}.mp4` };
    const transcriptParams = { Bucket:'ai-tutor-videos', Key: `${videoName}.json` };

    const video = await s3.send(new GetObjectCommand(videoParams));
    const transcript = await s3.send(new GetObjectCommand(transcriptParams));

    // const transcriptData = await streamToString(transcript.Body);

    return { video, transcript: JSON.parse(transcriptData) };
};

const floorToNearestFive = (time) => {
    return Math.floor(time / 5) * 5;
};

const fetchTranscriptText = async (req, res) => {
    const { videoName, pausedTime } = req.body;

    try {
        const { transcript } = await fetchVideoAndTranscript(videoName);
        const flooredTime = floorToNearestFive(pausedTime);

        const transcriptText = transcript[flooredTime];
        res.json({ transcriptText });
    } catch (error) {
        console.error('Error fetching transcript:', error);
        res.status(500).json({ error: 'Error fetching transcript' });
    }
};

const askAI = async (req, res) => {
    const { transcriptText } = req.body;

    try {
        const aiResponse = await axios.post('your-ai-endpoint-url', { text: transcriptText });
        res.json(aiResponse.data);
    } catch (error) {
        console.error('Error communicating with AI:', error);
        res.status(500).json({ error: 'Error communicating with AI' });
    }
};

// Fetch video by topic
const fetchVideoByTopic = async (req, res) => {
    const topic = req.params.topic;

    try {
        const videoName = getVideoNameForTopic(topic);
        const videoParams = { Bucket:'ai-tutor-videos', Key: `${videoName}.mp4` };
        const video = await s3.send(new GetObjectCommand(videoParams));

        res.setHeader('Content-Type', 'video/mp4');
        video.Body.pipe(res);
    } catch (error) {
        console.error('Error fetching video:', error);
        res.status(500).json({ error: 'Error fetching video' });
    }
};

// function getVideoNameForTopic(topic) {
//     const dummyMapping = {
//         'topic1': 'video1',
//         'topic2': 'video2',
//     };
//     return dummyMapping[topic] || 'default-video';
// }

module.exports = {
    fetchTranscriptText,
    askAI,
    fetchVideoByTopic,
};