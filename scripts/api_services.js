export function getExplorerData(folder, path = '') {
    if (path.length >= folder.length) {
        path = path.slice(folder.length + 1)
    }

    console.info(`http://localhost/shareFiles/${folder}/?path=${path}`)
    return new Promise((resolve, reject) => {
        $.get(`http://localhost/shareFiles/${folder}/?path=${path}`)
            .done(res => resolve(res))
            .fail(err => reject(err))
    })
}

