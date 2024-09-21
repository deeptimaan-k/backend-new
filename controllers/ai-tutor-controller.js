const AWS = require('aws-sdk');
const axios = require('axios');
const s3 = new AWS.S3();

const fetchVideoAndTranscript = async (videoName) => {
    const videoParams = { Bucket: 'ai-tutor-videos', Key: `${videoName}.mp4` };
    const transcriptParams = { Bucket: 'ai-tutor-videos', Key: `${videoName}.json` };

    const video = await s3.getObject(videoParams).promise();
    const transcript = await s3.getObject(transcriptParams).promise();

    return { video, transcript: JSON.parse(transcript.Body.toString()) };
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
        res.status(500).json({ error: 'Error fetching transcript' });
    }
};

const askAI = async (req, res) => {
    const { transcriptText } = req.body;

    try {
        const aiResponse = await axios.post('your-ai-endpoint-url', { text: transcriptText });
        res.json(aiResponse.data);
    } catch (error) {
        res.status(500).json({ error: 'Error communicating with AI' });
    }
};

const fetchVideoByTopic = async (req, res) => {
    const topic = req.params.topic;

    try {
        const videoName = getVideoNameForTopic(topic);
        const video = await s3.getObject({ Bucket: 'ai-tutor-videos', Key: `${videoName}.mp4` }).promise();

        res.send(video.Body);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching video' });
    }
};

// Example function to map topics to video names
function getVideoNameForTopic(topic) {
    const dummyMapping = {
        'topic1': 'video1',
        'topic2': 'video2',
    };
    return dummyMapping[topic] || 'default-video';
}

module.exports = {
    fetchTranscriptText,
    askAI,
    fetchVideoByTopic,
};