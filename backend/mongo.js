// Teht. 3.12 tietokanta komentoriviltä 
// ohjelma kysyy käyttäjältä komentorivillä salasanan, nimen ja numeron
// ja tallentaa ne MongoDB-tietokantaan
// lopuksi tallennetut tiedot tulostetaan konsoliin

const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as 1. argument')
    process.exit(1);
}

const password = process.argv[2]

const url =
  `mongodb+srv://nellisviili:${password}@cluster0.awpefb8.mongodb.net/`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
  
const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) { // jos on yksi argumentti
    console.log('phonebook:')
    Person.find({}).then(result => {
      result.forEach(person => {
        console.log(person.name + ' ' + person.number);
      })
      mongoose.connection.close()
    })

} else if (process.argv.length === 5) { // jos on 3 argumenttia
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then(() => {
        console.log(person.name + ' saved!')
        Person.find({}).then(result => {
          result.forEach(person => {
            console.log(person.name + ' ' + person.number);
          })
          mongoose.connection.close()
        })
    })

} else { // muussa tapauksessa
    console.log('give password as 1. argument')
    console.log('give name as 2. argument')
    console.log('give number as 3. argument')
    process.exit(1)    
}