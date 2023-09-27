const mongoose = require('mongoose');

module.exports = function(){
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true
    }).then(() => console.info('Connected to DB'))
    .catch(err => console.error(err));
}