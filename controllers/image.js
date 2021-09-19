const Clarifai = require('clarifai')

const app = new Clarifai.App({
    apiKey: 'a30c4520c2684a3dbf92414ae3f05444'
})

const handleApiCall = (req ,res) => {
    app.models
        .predict(
            Clarifai.FACE_DETECT_MODEL,
            req.body.input
        )
        .then(data => {
            res.json(data)
        })
        .catch(err => res.status(400).json('unable to wqork with API'))
}

const handleImage = (req, res, postgres) => {
    const {id} = req.body
    postgres('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0])
    })
    .catch(err =>res.status(400).json('unable to get entries'))
}

module.exports = {
    handleImage,
    handleApiCall,
}