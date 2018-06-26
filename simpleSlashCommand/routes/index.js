const express = require('express');
const router = express.Router();

/* GET slash command. */
router.post('/', function(req, res, next) {

    // Create an array of strings with image url's
    let images = [
        "https://memegenerator.net/img/instances/28654190/me-neither.jpg",
        "https://img.memecdn.com/me-neither_o_830020.jpg",
        "https://meme.xyz/uploads/posts/t/l-25906-i-have-no-idea-what-im-doing.jpg",
        "http://i0.kym-cdn.com/photos/images/newsfeed/000/107/973/I-smile-because-i-have-no-idea-whats-going-on.jpg"
    ];
    // Select a random image to show
    imageIndex = Math.floor(Math.random() * images.length);

    // IMPORTANT!
    let data = {
        response_type: 'in_channel', // public to the channel. If use 'ephemeral' only will be visible to the user.
        text: 'Aquí tienes!', // Optional text
        attachments:[{
            image_url: images[imageIndex]
        }]
    };
    res.json(data);
});

module.exports = router;
