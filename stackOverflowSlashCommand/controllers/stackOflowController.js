const self = {};
const stackOflowService = require('../services/stackOflowService');
const axios = require('axios');
const Entities = require('html-entities').XmlEntities;
const TurndownService = require('turndown');
const entities = new Entities();

const turndownService = new TurndownService({codeBlockStyle: 'fenced', strongDelimiter: '*'});
turndownService.addRule('strikethrough', {
  filter: ['a'],
  replacement: (content, node) => node.getAttribute('href')
})


self.getQuestions = function(req, res) {
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
                            // Remove self links

                    }],
                    mrkdwn_in: ["fields"],
                    footer: "Stack Overflow",
                    ts: question.last_activity_date
                }))
            };
            console.log(data.attachments.map(a => a.fields[0]))
            res.json(data);
        }
    } )
}

module.exports = self;
