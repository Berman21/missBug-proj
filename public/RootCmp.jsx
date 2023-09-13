const {useState} = React

const Router = ReactRouterDOM.BrowserRouter
const {Routes, Route} = ReactRouterDOM

import {AppHeader} from './cmps/AppHeader.jsx'
import {Team} from './cmps/Team.jsx'
import {UserMsg} from './cmps/UserMsg.jsx'
import {Vision} from './cmps/Vision.jsx'
import {About} from './pages/About.jsx'
import {BugDetails} from './pages/BugDetails.jsx'
import {BugEdit} from './pages/BugEdit.jsx'
import {BugIndex} from './pages/BugIndex.jsx'
import {Home} from './pages/Home.jsx'

export function App() {
  const [page, setPage] = useState('bug')

  function onSetPage(page) {
    setPage(page)
  }

  return (
    <Router>
      <section className="app main-layout">
        <AppHeader onSetPage={onSetPage} />

        <main className="main-layout full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />}>
              <Route path="team" element={<Team />} />
              <Route path="vision" element={<Vision />} />
            </Route>
            <Route path="/bug/:bugId" element={<BugDetails />} />
            <Route path="/bug/edit/:bugId" element={<BugEdit />} />
            <Route path="/bug/edit" element={<BugEdit />} />
            <Route path="/bug" element={<BugIndex />} />
          </Routes>
        </main>
        <UserMsg />
      </section>
    </Router>
  )
}
