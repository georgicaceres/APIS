const self = {};
const stackOflowService = require('../services/stackOflowService');

// Promise based HTTP client for the browser and node.js
const axios = require('axios');
// Unescape html entities in string. See: https://www.npmjs.com/package/html-entities
const Entities = require('html-entities').XmlEntities;
// Converts HTML to Markdowns in Slack flavor. See demo here: http://domchristie.github.io/turndown/
const TurndownService = require('turndown');

const entities = new Entities();
const turndownService = new TurndownService({codeBlockStyle: 'fenced', strongDelimiter: '*'});
turndownService.addRule('links', {
    // Remove links (only aesthetic use)
    filter: ['a'],
    replacement: (content, node) => node.getAttribute('href')
});

self.getQuestions = function(req, res) {
    // "req.body.text" is the input text inserted by de user after /stackoverflow
    stackOflowService.getQuestion(req.body.text)
    .then(function(questions) {
        const colors = ["#c72653","#53C726", "#2653C7"]
        if (questions.length) {
            let data = {
                response_type: 'in_channel', // public to the channel. If use 'ephemeral' only will be visible to the user.
                text: 'Encontré esto:', // Optional text
                attachments: questions.map((question, index) => ({
                    color: colors[index],
                    title: entities.decode(question.title),
                    title_link: question.link,
                    fields: [{
                        title: "Accepted Answer:",
                        value: turndownService.turndown(question.answer)
                            // Remove double newlines
                            .split('\n\n').join('\n')

                    }],
                    mrkdwn_in: ["fields"],
                    footer: "Stack Overflow",
                    ts: question.last_activity_date
                }))
            };
            res.json(data);
        }
    })
    .catch(function(err) {
        res.send(err.message);
    })
}

module.exports = self;
