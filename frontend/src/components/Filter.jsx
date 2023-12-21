// vastaa filtteröintikyselystä

const Filter = ({ newCondition, handleSearch }) => {

  return (
    <div>
      filter shown with <input value={newCondition} onChange={handleSearch} />
    </div>
  )
}

export default Filter