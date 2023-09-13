const { useState, useEffect } = React

export function BugSort({ sort, setSort }) {

    const [sortByToEdit, setSortByToEdit] = useState({ ...sort })

    useEffect(() => {
        setSort(sortByToEdit)
    }, [sortByToEdit])

    function handleChange({ target }) {
        const field = target.name
        const value = target.type === 'number' ? +target.value : target.value
        if (field === 'desc') setSortByToEdit(prevSort => ({
            ...prevSort,
            desc: -(prevSort.desc)
        }))
        else setSortByToEdit((prevSort) => ({
            ...prevSort,
            [field]: value,
        }))
    }

    return (
        <form className="bug-sort">
            <select className="sort-type" name="type" value={sortByToEdit.type} onChange={handleChange}>
                <option value="minSeverity">Severity</option>
                <option value="createdAt">Date</option>
            </select>
            <label>
                <input type="checkbox" name="desc" checked={sortByToEdit.desc > 0} onChange={handleChange} />
                Descending
            </label>
        </form >
    )
}