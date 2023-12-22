// teht 2.17 puhelinluettelo step12
// tehdään parempi virheilmoitus samaisella logiikalla
// kuin edellisen vaiheen tietojenpäivitysilmoitukset
// luotu uusi komponentti Error huolehtimaan virheilmoituksista käyttäjälle
// teht 3.17-.18 lisätty virheilmoitukset virheellisille käyttäjäsyötteille

import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'
import Filter from './components/Filter'
import Numbers from './components/Numbers'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'
import Error from './components/Error'

const baseUrl = '/api/persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newCondition, setNewCondition] = useState('')
  const [filteredPersons, setFilteredPersons] = useState(persons)
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null);

  const addNumber = (event) => {
    event.preventDefault()

    const dublicatePerson = persons.find((person) => person.name === newName);
    const newObject = {
      name: newName,
      number: newNumber,
    }

    if (dublicatePerson) {
      const replaceNumber = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
  
      if (replaceNumber) {
        personService
          .update(dublicatePerson.id, newObject) 

          .then((returnedPerson) => {
            setPersons(
              persons.map((person) => person.id === returnedPerson.id ? returnedPerson : person)
            )
            setFilteredPersons(
              persons.map((person) => person.id === returnedPerson.id ? returnedPerson : person)
            )
            setNotificationMessage(
              `The number '${newObject.number}' has been saved for '${dublicatePerson.name}'`
            )
            setTimeout(() => {          
              setNotificationMessage(null)        
            }, 5000)

            setNewName('')
            setNewNumber('')
          
          console.log('number changed')
          })
          
      } else {
        console.log('Number change cancelled')
      }

    } else {
      const newObject = {
        name: newName,
        number: newNumber,
      }
      setPersons(persons.concat(newObject))
      setNewName('')
      setNewNumber('')

      personService
        .create(newObject)
        .then(returnedPerson => {
          console.log(returnedPerson)
          setPersons(persons.concat(returnedPerson))
          setFilteredPersons(persons.concat(returnedPerson))

          setNotificationMessage(
            `'${returnedPerson.name}' added.`
          )
          setTimeout(() => {          
            setNotificationMessage(null)        
          }, 5000)

          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          const errorMessage = error.response.data.error;

          if (errorMessage.includes('number')) {
            setErrorMessage(
              `Number is not valid. Should be in the format 12-345678.. or 123-45678..`
            )
          } else {
            setErrorMessage(
              `Name is not valid. Should be longer than the minimum length (3)`
            )
          }
          console.log(error.response.data)

          setTimeout(() => {
            setErrorMessage(null)
          }, 5000 )
        })
      
      console.log("saved ", newName, newNumber)
      console.log(persons)
    }
  }

  const removePerson = (id) => {
    const personToBeDeleted = persons.find((person) => person.id === id)
  
    if (window.confirm(`Are you sure you want to delete ${personToBeDeleted.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id))
          setFilteredPersons(persons.filter((person) => person.id !== id))

          setNotificationMessage(
            `'${personToBeDeleted.name}'s removed from the Phonebook`
          )
          setTimeout(() => {          
            setNotificationMessage(null)        
          }, 5000)

        })
        .catch(error => {
          setErrorMessage(
            `Information of '${personToBeDeleted.name}' has already removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000 )

          setFilteredPersons(persons.filter((person) => person.id !== id))
        })
        
    } else {
      console.log('Deletion cancelled')
    }
  }

  // useEffect(() => {setFilteredPersons(persons)}, [persons])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    const condition = event.target.value
    setNewCondition(condition)
  
    const filtered = persons.filter((person) =>
      person.name.toLowerCase().includes(condition.toLowerCase())
    )
    
    setFilteredPersons(filtered)
  }

  const hook = () => {
    console.log('effect')
    axios
      .get('/api/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
        setFilteredPersons(response.data)
      })
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
        setFilteredPersons(initialPersons)
      })
  }
  
  useEffect(hook, [])

  console.log('render', persons.length, 'persons')
  
  return (
    <div>
      <Notification message={notificationMessage} />
      <Error message={errorMessage} />
      <h1>Phonebook</h1>
      <Filter newCondition={newCondition} handleSearch={handleSearch} />
      <div>
      <h2>Add a new</h2>
        <PersonForm
          newName={newName}
          newNumber={newNumber}
          handleNameChange={handleNameChange}
          handleNumberChange={handleNumberChange}
          addNumber={addNumber}
        />
      </div>

      <h2>Numbers</h2>
      <Numbers filteredPersons={filteredPersons} removePerson={removePerson}/> 
    </div>
  )
}

export default App