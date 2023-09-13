import fs from 'fs'
import { utilService } from './util.service.js'
import { loggerService } from './logger.service.js'

export const bugService = {
    query,
    getById,
    remove,
    save
}
const PAGE_SIZE = 3
const bugs = utilService.readJsonFile('data/bug.json')

function query(filterBy = {}, sortBy) {
    let bugsToReturn = bugs
    if (filterBy.title) {
        const regExp = new RegExp(filterBy.title, 'i')
        bugsToReturn = bugsToReturn.filter(bug => regExp.test(bug.title) || regExp.test(bug.description))
    }

    if (filterBy.minSeverity) {
        bugsToReturn = bugsToReturn.filter(bug => bug.minSeverity >= filterBy.minSeverity)
    }

    if (filterBy.labels) {
        const labelsToFilter = filterBy.labels
        bugsToReturn = bugsToReturn.filter((bug) =>
            labelsToFilter.every((label) => bug.labels.includes(label))
        )
    }

    const pageCount = Math.ceil(bugsToReturn.length / PAGE_SIZE)
    bugsToReturn = getSortedBugs(bugsToReturn, sortBy)

    if (filterBy.pageIdx !== undefined) {
        const startIdx = filterBy.pageIdx * PAGE_SIZE
        bugsToReturn = bugsToReturn.slice(startIdx, startIdx + PAGE_SIZE)
    }
    const data = { bugsToReturn, pageCount }
    return Promise.resolve(data)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Bug not found!')
    return Promise.resolve(bug)
}

function remove(bugId, loggedinUser) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject('No Such bug')
    const bug = bugs[idx]
    if (!loggedinUser.isAdmin &&
        bug.owner._id !== loggedinUser._id) {
        return Promise.reject('Not your bug')
    }

    bugs.splice(idx, 1)
    return _saveBugsToFile()
}

function save(bug, loggedinUser) {
    if (bug._id) {
        const bugIdx = bugs.find((currBug) => currBug._id === bug._id)
        bugs[bugIdx].title = bug.title
        bugs[bugIdx].minSeverity = bug.minSeverity
        bugs[bugIdx].description = bug.description
        bugs[bugIdx].labels = bug.labels
    } else {
        bug = {
            _id: utilService.makeId(),
            title: bug.title,
            minSeverity: bug.minSeverity,
            description: bug.description,
            labels: bug.labels,
            owner: loggedinUser

        }
        bugs.unshift(bug)
    }

    return _saveBugsToFile().then(() => bug)
}

function getSortedBugs(bugsToReturn, sortBy) {

    // if (sortBy.type === 'minSeverity') bugsToReturn.sort((b1, b2) => (b2.minSeverity - b1.minSeverity))
    // else bugsToReturn.sort((b1, b2) => (b2.createdAt - b1.createdAt))

    if (sortBy.createdAt) {
        bugsToReturn.sort((bug1, bug2) => {
            if (sortBy.createdAt < 0) return bug1.createdAt - bug2.createdAt
            return bug2.createdAt - bug1.createdAt
        })
    }
    if (sortBy.minSeverity) {
        bugsToReturn.sort((bug1, bug2) => {
            if (sortBy.minSeverity < 0) return bug1.minSeverity - bug2.minSeverity
            return bug2.minSeverity - bug1.minSeverity
        })
    }

    bugsToReturn.sort(
        (b1, b2) => sortBy.desc * (b2[sortBy.type] - b1[sortBy.type])
    )
    return bugsToReturn
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                loggerService.error('Cannot write to bugs file', err)
                return reject(err);
            }
            console.log('The file was saved!');
            resolve()
        });
    })
}

