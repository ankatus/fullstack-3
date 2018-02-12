const mongoose = require('mongoose')

const url = "mongodb://fullstack:salis@ds227858.mlab.com:27858/fullstack-3"

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String,
    id: Number
})
if (process.argv[2] === undefined) {
    console.log("puhelinluettelo:")
    Person
        .find({})
        .then(result => {
            result.forEach(person => {
                console.log(person.name + " " + person.number + "")
            })
            mongoose.connection.close()
        })
} else {
    const personName = process.argv[2]

    const personNumber = process.argv[3]

    const person = new Person({
        name: personName,
        number: personNumber
    })

    person.save().then(result => {
        console.log("lisätään henkilö " + person.name + " numero " + person.number + " luetteloon")
        mongoose.connection.close()
    })
}