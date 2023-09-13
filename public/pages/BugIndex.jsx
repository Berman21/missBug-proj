import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugList } from '../cmps/BugList.jsx'
import { bugService } from '../services/bug.service.js'
import { utilService } from "../services/util.service.js"
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugSort } from '../cmps/BugSort.jsx'

const { useEffect, useState, useRef } = React
const { Link } = ReactRouterDOM

export function BugIndex() {

  const [bugs, setBugs] = useState(null)
  const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
  const debouncedSetFilter = useRef(utilService.debounce(onSetFilter, 500))

  const [sort, setSort] = useState({ type: '', desc: 1 })
  const [pageCount, setPageCount] = useState(null)

  useEffect(() => {
    loadBugs()
    showSuccessMsg('Welcome to bug index!')
  }, [filterBy, sort])

  function loadBugs() {
    bugService.query(filterBy, sort)
      .then((data) => {
        setBugs(data.bugsToReturn)
        setPageCount(data.pageCount)
      })
  }

  function onRemoveBug(bugId) {
    bugService
      .remove(bugId)
      .then(() => {
        setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
        showSuccessMsg(`Bug (${bugId}) removed!`)
      })
      .catch((err) => {
        console.log('err:', err)
        showErrorMsg('Problem Removing ' + bugId)
      })
  }

  function onSetFilter(filterBy) {
    setFilterBy((prevFilterBy) => ({ ...prevFilterBy, ...filterBy }))
  }

  function onChangePageIdx(diff) {
    const nextPageIdx = filterBy.pageIdx + diff
    if (nextPageIdx === pageCount) {
      setFilterBy(prevFilterBy => ({ ...prevFilterBy, pageIdx: 0 }))
    } else if (nextPageIdx === -1) {
      console.log(filterBy.pageIdx)
      setFilterBy(prevFilterBy => ({ ...prevFilterBy, pageIdx: pageCount - 1 }))
    } else setFilterBy(prevFilterBy => ({ ...prevFilterBy, pageIdx: nextPageIdx }))
  }

  function onExportToPdf() {
    bugService.exportToPdf()
  }

  if (!bugs) return <div>Loading...</div>
  return (
    <section className="bug-index full main-layout">


      <BugFilter onSetFilter={debouncedSetFilter.current} filterBy={filterBy} />
      <BugSort sort={sort} setSort={setSort} />

      <div className="action-btns flex justify-center align-center">
        <Link to="/bug/edit">Add Bug</Link>
        <button className="btn-pdf" onClick={onExportToPdf}>
          Download PDF
        </button>
      </div>

      <BugList bugs={bugs} onRemoveBug={onRemoveBug} sort={sort} setSort={setSort} />

      <section>
        <button onClick={() => { onChangePageIdx(1) }}>+</button>
        {filterBy.pageIdx + 1}
        <button onClick={() => { onChangePageIdx(-1) }}>-</button>
        <button onClick={() => setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: undefined }))}>Cancel pagination</button>
      </section>
      
    </section>
  )
}
