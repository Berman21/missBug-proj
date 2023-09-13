
const BASE_URL = '/api/bug/'

export const bugService = {
    query,
    get,
    remove,
    save,
    getEmptyBug,
    getDefaultFilter,
    exportToPdf
}

function query(filterBy = getDefaultFilter(), sortBy = { type: 'minSeverity', desc: 1 }) {
    const filterSortBy = { ...filterBy, ...sortBy }
    return axios.get(BASE_URL, { params: filterSortBy }).then(res => res.data)
}

function get(bugId) {
    return axios.get(BASE_URL + bugId).then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId).then(res => res.data)
}

function save(bug) {

    const method = bug._id ? 'put' : 'post'
    return axios[method](BASE_URL, bug).then(res => res.data)

    // if(bug._id) return axios.put(BASE_URL,bug).then(res => res.data)
    // else return axios.post(BASE_URL,bug).then(res => res.data)

    // const url = BASE_URL + 'save'
    // let queryParams = `?title=${bug.title}&description=${bug.description}&minSeverity=${bug.minSeverity}`
    // if (bug._id) queryParams += `&_id=${bug._id}`
}


function exportToPdf() {
    return axios.get(BASE_URL + 'export', { responseType: 'blob' }).then((res) => {
        // Create a Blob from the response data
        const blob = new Blob([res.data], { type: 'application/pdf' })

        // Create a temporary URL for the Blob
        const url = window.URL.createObjectURL(blob)

        // Create a link element to trigger the download
        const a = document.createElement('a')
        a.href = url
        a.download = 'SaveTheBugs.pdf'
        a.click()

        // Release the object URL when done
        window.URL.revokeObjectURL(url)
    })
}

function getEmptyBug(title = '', minSeverity = '', description = '') {
    return { _id: '', title, minSeverity, description, createdAt: Date.now() }

}

function getDefaultFilter() {
    return {
        title: '',
        minSeverity: '',
        labels: '',
        pageIdx: 0
    }
}

