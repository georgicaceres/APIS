const service = {};
const axios = require('axios');

service.getQuestion = function(questionText) {
    return axios.get('https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=relevance&q=' + escape(questionText) + '&site=stackoverflow&accepted=true')
    .then(function(res) {
        const questions = res.data.items.filter(item => item.is_answered).slice(0, 3);
        const ids = questions.map(item => item.question_id).join(';');
        return axios
            .get('https://api.stackexchange.com/2.2/questions/' + ids + '/answers?order=desc&sort=votes&site=stackoverflow&filter=!9Z(-wzfpy')
            .then(function(answers) {
                return questions
                    .map(question => ({
                        ...question,
                        answer: answers.data.items
                            .find(a => a.question_id == question.question_id && a.is_accepted).body
                    }));
            })
            .catch(function(err) {
                console.log("cacho", err.message);
            })
    })
    .catch(function(err) {
        console.log("el otro cacho", err.message);
    })
}

module.exports = service;
