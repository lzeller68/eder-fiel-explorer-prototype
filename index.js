import {
    createListItem,
    createUnorderedList,
    onChangeGalleryItemSelection, updateCurrentPath,
    updateExplorerGallery,
} from "/scripts/dom_manipulation_functions.js";
import {
    getExplorerData
} from "/scripts/api_services.js";
import {
    getIdNameForElement,
    getPathFromChildString,
    getIdForUlElement
} from "./scripts/helpers.js";

export var selectedFiles = [];
$().ready(async () => {
    console.log('Loaded File Explorer')

    //----------------STEP 1: Get data from API
    let gallery = await getExplorerData('gallery')
    let designs = await getExplorerData('designs')
    //----------------STEP 2: Load UI
    loadExplorerTreeNode('gallery', gallery)
    loadExplorerTreeNode('designs', designs)
    addEventListeners();
})


//----------------STEP 3: Load explorer tree
function loadExplorerTreeNode(folder, node) {
    //----------------STEP 4: Load parent nodes (parent === null)
    if (!node.parent) {
        let path = folder
        let listItem = createListItem(folder, node, path)
        let unorderedList = createUnorderedList(folder, node, path)
        $('#root').append(listItem).append(unorderedList)
    }

    //----------------STEP 5: Load child nodes for tree
    if (node.children.length > 0) {
        loadChildrenOfNode(folder, node.children)
    }

}


//----------------STEP 5: Load child nodes for tree
function loadChildrenOfNode(folder, children) {

    children.forEach(element => {
        if (element.isDir) {
            let nodePath = getPathFromChildString(element)
            let listItem = createListItem(folder, element, nodePath);
            let unorderedList = createUnorderedList(folder, element, nodePath)
            listItem.setAttribute('is-folder', 'true')
            let liID = getIdNameForElement(nodePath)
            let ulId = getIdForUlElement(liID, element.label)

            $(`#ul${ulId}`).append(listItem)
            $(`#li${getIdNameForElement(nodePath)}`).after(unorderedList)
        }
    })
}

export async function updateExplorerTree(ev) {
    let folder = ev.currentTarget.getAttribute('root-folder')
    let currentPath = ev.currentTarget.getAttribute('path')

    let ulId = getIdNameForElement(currentPath)
    $(`#ul${ulId}`).children().remove()

    let pathAttribute = ev.currentTarget.getAttribute('path')

    let rootFolderLength = folder.length;
    let pathOfListElement = pathAttribute.substring(++rootFolderLength, pathAttribute.length)

    let x = await getExplorerData(folder, pathOfListElement)

    updateCurrentPath(currentPath)

    loadChildrenOfNode(folder, x.children)

}



function addEventListeners() {
    $('body').on('click', 'li', async ev => {
        await updateExplorerTree(ev);
        await updateExplorerGallery(ev.currentTarget)
    })

    $('body').on('click', '.gallery-item', async ev => {
        let isFolder = ev.currentTarget.getAttribute('is-folder');
        if (isFolder === 'true') {
            await updateExplorerTree(ev)
            await updateExplorerGallery(ev.currentTarget)
        } else {
            onChangeGalleryItemSelection(ev)
        }
    })

    $('body').on('click', '.btn-open-selected-files', ev => {
        ev.preventDefault()
        console.log(selectedFiles)
    })

    $('body').on('click', '.div-communication-modal .div-communication-modal-row .div-attached-files .div-file .div-remove-button', ev => {
        console.log(ev.currentTarget)
    })

}



