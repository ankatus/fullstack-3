const mongoose = require('mongoose')
const url = process.env.MONGODB_URI
mongoose.connect(url)

const Schema = mongoose.Schema

const personSchema = new Schema ({
    name: String,
    number: String
})

personSchema.statics.format = (person) => {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}

const Person = mongoose.model('Person', personSchema)

module.exports = Person