// Teht 3.17 ja 3.18 personSchema-validointia
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// määritellään person-olion validointisäädökset
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        // onko muotoa 2-3 numeroa, väliviiva, min 5-6 numeroa
        return /^\d{2,3}-\d{5,6}$/.test(v);
      },
      message: props => `${props.value} is not a valid number. Should be in the format 12-345678.. or 123-45678..`
    },
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)