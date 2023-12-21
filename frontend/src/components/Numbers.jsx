// vastaa nimien ja numeroiden tulostuksesta näytölle
// tarjoaa delete-nappulan tietojen poistoon rekisteristä

const Numbers = ({ filteredPersons, removePerson}) => {

  
  return (
    <div>
      {filteredPersons.map((person, index) => (
        <p key={index}>
          {person.name} {person.number}
          <button onClick={() => removePerson(person.id)}>Delete</button>
        </p>
      ))}
    </div>
  )
}

export default Numbers