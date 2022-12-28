export function getIdNameForElement(currentPath){
    let pathArray = currentPath.split('/');
    let path = '';

    pathArray.forEach(p => {
        path += `-${p}`
    })

    return path
}

export function getIdForUlElement(path, label) {
    return path.substring(0, path.length - (label.length + 1))
}

export function getPathFromChildString(node) {
    if (node.child) {

        if (node.child.slice(0, 9) === 'filesync/') {
            let path = node.child.substring(9, node.child.length)
            return path
        }
    }
}

export function convertPathToArray(path){
    return path.split('/');
}