import express from 'express'
import cookieParser from 'cookie-parser'


import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { userService } from './services/user.service.js'
import { pdfService } from './services/pdf.service.js'
import path from 'path'

const app = express()

// App Configuration
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())// for req.body


// Get Bugs (READ)
app.get('/api/bug', (req, res) => {
    //  console.log('req.body', req.body)

    const { title, minSeverity, pageIdx, labels, type, desc } = req.query
    const filterBy = { title, minSeverity, labels, pageIdx }
    const sortBy = { type, desc }

    bugService.query(filterBy, sortBy)
        .then(data => {
            res.send(data)
        }).catch((err) => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

// Save Bug (CREATE/UPDATE)
app.post('/api/bug', (req, res) => {
    //  console.log('req.body', req.body)

    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')

    const { title, minSeverity, description, createdAt, labels } = req.body
    const bug = {
        title,
        minSeverity: +minSeverity,
        description,
        createdAt,
        labels,
    }

    bugService.save(bug,loggedinUser)
        .then((savedBug) => { res.send(savedBug) })
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

// update
app.put('/api/bug', (req, res) => {
    console.log('req.body', req.body)

    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update bug')

    const { _id, title, minSeverity, description, createdAt, labels } = req.body
    const bug = {
        _id,
        title,
        minSeverity: +minSeverity,
        description,
        createdAt,
        labels,
    }

    bugService.save(bug,loggedinUser)
        .then((savedBug) => { res.send(savedBug) })
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

//Pdf bonus
app.get('/api/bug/export', (req, res) => {

    bugService.query().then(pdfService.buildPDF).then((pdfFileName) => {
        const pdfFilePath = path.join(process.cwd(), pdfFileName)
        // Send the PDF file to the client
        return res.sendFile(pdfFilePath) //SaveTheBugs.pdf
    }).catch(err => {
        loggerService.error('Cannot get Pdf', err)
        res.status(400).send('Cannot get Pdf')
    })
})

// Get Bug (READ)
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    const { visitCountMap = [] } = req.cookies // use the default if undefined
    console.log('visitCountMap', visitCountMap)

    if (visitCountMap.length > 3) return res.status(401).send('Wait for a bit')
    if (!visitCountMap.includes(bugId)) visitCountMap.push(bugId)
    res.cookie('visitCountMap', visitCountMap, { maxAge: 1000 * 7 })
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
})

// Remove Bug (Delete)
app.delete('/api/bug/:bugId', (req, res) => {

    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot delete bug')

    const { bugId } = req.params
    bugService.remove(bugId,loggedinUser)
        .then(() => {
            loggerService.info(`Bug ${bugId} removed`)
            res.send({ msg, bugId })
        })
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
})

// Get Users (READ)
app.get('/api/user', (req, res) => {

    userService.query()
        .then(users => {
            res.send(users)
        })
        .catch(err => {
            loggerService.error('Cannot get users', err)
            res.status(400).send('Cannot get users')
        })
})

// Get Users (READ)
app.get('/api/user/:userId', (req, res) => {

    const { userId } = req.params

    userService.getById(userId)
        .then(user => {
            res.send(user)
        })
        .catch(err => {
            loggerService.error('Cannot get user', err)
            res.status(400).send('Cannot get user')
        })
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})



app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.add(credentials)
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            loggerService.error('Cannot signup', err)
            res.status(400).send('Cannot signup')
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Loggedout..')
})


app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const PORT = 3030
app.listen(PORT, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)