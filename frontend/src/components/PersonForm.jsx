// vastaa annettujen nimen ja numeron käsittelystä

const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, addNumber}) => {
  return (
    <div>
      <form onSubmit={addNumber}>
      <div>
        name: <input value={newName} onChange={handleNameChange} /> <br /><br />
        number: <input value={newNumber} onChange={handleNumberChange} /> <br /><br />
        <button type="submit">add</button>
      </div>
      </form>
  </div>
  )
}

export default PersonForm