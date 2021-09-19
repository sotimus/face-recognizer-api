const handleProfileGet = (req, res, postgres) => {
    const {id} = req.params
    postgres.select('*').from('users').where({id})
        .then(user => {
            if (user.length){
                res.json(user[0])
            }
            else{
                res.status(404).json('Not found')
            }
        })
        .catch(err => res.status(400).json('No such user'))
}

module.exports = {
    handleProfileGet
}