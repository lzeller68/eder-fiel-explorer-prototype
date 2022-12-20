import {TREE_ARRAY} from "/scripts/static_data.js";
import {
    createListItem,
    createUnorderedList,
    loadGalleryItems, onChangeGalleryItemSelection,
    onClickGalleryFolder,
    setCurrentPath
} from "/scripts/dom_manipulation_functions.js";

export var selectedFiles = [];
$().ready(async () => {
    console.log('Loaded File Explorer')
    //loadExplorer(TREE_ARRAY);
    let gallery = await getExplorerData('gallery')
    let designs = await getExplorerData('designs')
    loadExplorerTreeNode('gallery',gallery)
    //loadExplorerTreeNode('designs',designs)
    addEventListeners();
})


function loadExplorerTreeNode(folder,node) {
    if (!node.parent) {
        console.log(folder)
        let listItem = createListItem(folder,node)
        let unorderedList = createUnorderedList(folder,node)
        $('#root').append(listItem).append(unorderedList)
    }

    loadChildrenOfNode(folder, node.children)
}

function loadChildrenOfNode(folder, children) {
    $(`#ul-${checkIfParentIsRoot(children[0])}`).empty()
    children.forEach(element => {
        if (element.isDir) {
            let parent = checkIfParentIsRoot(element)
            let listItem = createListItem(folder, element);
            listItem.setAttribute('is-folder', 'true')
            $(`#ul-${folder}-${parent}`).append(listItem)
            $(`#li-${folder}-${element.label}`).after(createUnorderedList(folder, element))
        }
    })

}

function checkIfParentIsRoot(element){
    return (element.parent === '/') ? 'root' : element.parent
}


export async function updateTreeAndGalleryView(ev) {
    let folder = ev.currentTarget.getAttribute('root-folder')
    await loadGalleryItems(folder, ev.currentTarget)
    let path = (ev.currentTarget.children[1].textContent === 'Root') ? '/' : ev.currentTarget.children[1].textContent
    $(`#ul-${folder}-${(path === '/') ? 'root' : path}`).children().remove()
    let x = await getExplorerData(folder,path)
    loadChildrenOfNode(folder, x.children)
}

function addEventListeners() {
    $('body').on('click', 'li', async ev => {
        //setCurrentPath(ev.currentTarget)
        await updateTreeAndGalleryView(ev);
    })

    $('body').on('click', '.gallery-item', async ev => {
        if (ev.currentTarget.getAttribute('is-folder') === 'true') {
            await onClickGalleryFolder(ev)
        } else {
            onChangeGalleryItemSelection(ev)
        }
    })
    $('body').on('click', '.customized-span-tag', async ev => {
        await onClickGalleryFolder(ev.target)
    })

    $('body').on('click', '.btn-open-selected-files', ev => {
        ev.preventDefault()
        console.log(selectedFiles)
    })

    $('body').on('click', '.div-communication-modal .div-communication-modal-row .div-attached-files .div-file .div-remove-button', ev => {
        console.log(ev.currentTarget)
    })

}

export async function getExplorerData(folder, path = '') {
    console.info(`http://localhost/shareFiles/${folder}/?path=${path}`)
    return new Promise((resolve, reject) => {
        $.get(`http://localhost/shareFiles/${folder}/?path=${path}`)
            .done(res => resolve(res))
            .fail(err => reject(err))
    })
}

