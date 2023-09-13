const { useState, useEffect } = React
import { LabelSelector } from './LabelSelect.jsx'

export function BugFilter({ filterBy, onSetFilter }) {

  const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

  const labels = [
    'critical',
    'need-CR',
    'dev-branch',
    'famous',
    'high',
    'save',
    'low',
    'database',
    'shopping-cart',
    'image',
    'font',
    'ux',
    'checkout',
    'login',
    'form',
    'spelling',
    'spacing',
    'button',
    'registration',
    'navigation',
    'link',
    'resource',
  ]

  useEffect(() => {
    onSetFilter(filterByToEdit)
  }, [filterByToEdit])

  function handleChange({ target }) {
    const field = target.name
    let value = target.value

    switch (target.type) {
      case 'number':
      case 'range':
        value = +value || ''
        break

      case 'checkbox':
        value = target.checked
        break

      default:
        break
    }

    setFilterByToEdit((prevFilterBy) => ({ ...prevFilterBy, [field]: value }))
  }

  function onLabelChange(selectedLabels) {
    setFilterByToEdit((prevFilter) => ({
      ...prevFilter,
      labels: selectedLabels,
    }))
  }

  function onSubmitFilter(ev) {
    ev.preventDefault()
    console.log(filterByToEdit);
    onSetFilter(filterByToEdit)
  }



  const { title, minSeverity, label } = filterByToEdit


  return (
    <section className="bug-filter full main-layout">
      <h2>Filter Our Bugs</h2>

      <form onSubmit={onSubmitFilter}>
        <label htmlFor="title">Text:</label>
        <input
          value={title}
          onChange={handleChange}
          name="title"
          id="title"
          type="text"
          placeholder="By title"
        />

        <label htmlFor="minSeverity">Severity:</label>
        <input
          value={minSeverity}
          onChange={handleChange}
          type="number"
          name="minSeverity"
          id="minSeverity"
          placeholder="By Severity"
        />

        <LabelSelector labels={labels} onLabelChange={onLabelChange} />

        <button>Filter Bugs</button>
      </form>
    </section>
  )
}
