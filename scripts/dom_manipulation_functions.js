import {TREE_ARRAY} from "./static_data.js";
import {getExplorerData, selectedFiles, updateTreeAndGalleryView} from '/index.js';

let currentPath = '';

export function onChangeGalleryItemSelection(ev) {
    let isSelected = (ev.currentTarget.getAttribute('is-selected') === 'true')
    ev.currentTarget.setAttribute('is-selected', !isSelected)
    isSelected = (ev.currentTarget.getAttribute('is-selected') === 'true')
    let path = ev.currentTarget.getAttribute('path')

    if (isSelected) {
        path = (path[0] === '/')? path.slice(1): path;
        if(!selectedFiles.includes(path)){
            selectedFiles.push(path)
        }
    } else {
        let idx = selectedFiles.indexOf(path)
        selectedFiles.splice(idx, 1)
    }

    let files = selectedFiles.length

    $('.div-selected-files').empty()
    $('.div-selected-files').append(`Ausgewählte Elemente: [${files}]`)

    let x = $(ev.currentTarget).find('.icon')
    x[0].src = (isSelected) ? '../assets/icons/select_check_box.svg' : '../assets/icons/check_box_outline_blank.svg'
}

export function createListItem(folder, element) {
    let li = document.createElement('li');
    let icon = document.createElement('img')
    let label = document.createElement('label')
    li.style.display = 'flex'
    li.style.alignItems = 'center'
    icon.src = '../assets/icons/chevron_right.svg';
    icon.alt = 'expanded';
    icon.style.width = '20px'
    label.textContent = (element.label === '/') ? folder : element.label
    li.append(icon)
    li.append(label)


    let path = getParentsPath(element.parent, element.label)
    li.setAttribute('path', path)
    let lbl = (element.label === '/')? 'root': element.label
    li.setAttribute('id', `li-${folder}-${lbl}`)
    li.setAttribute('root-folder', folder)
    return li;
}

export function createUnorderedList(folder, element) {
    let ul = document.createElement('ul')
    let lbl = (element.label === '/')? 'root': element.label
    ul.setAttribute('id', `ul-${folder}-${lbl}`)
    return ul;
}

function createGalleryItem(element, path, isSelected = false, rootFolder) {
    let div = document.createElement('div')
    let img = document.createElement('img')
    let divInfo = document.createElement('div')
    let label = document.createElement('label')
    let divSelection = document.createElement('div')
    let imgIcon = document.createElement('img')

    div.setAttribute('class', 'gallery-item')
    div.setAttribute('root-folder', rootFolder)
    div.setAttribute('is-selected', isSelected.toString())
    div.setAttribute('path', `${path}/${element.label}`)
    let isFolder = element.isDir
    div.setAttribute('is-folder', isFolder.toString())

    divInfo.setAttribute('class', 'div-info');
    divSelection.setAttribute('class', 'div-selection')
    imgIcon.setAttribute('class', 'icon')

    imgIcon.src = (isSelected) ? '../assets/icons/select_check_box.svg' : '../assets/icons/check_box_outline_blank.svg'

    divSelection.appendChild(imgIcon)


    img.src = (isFolder) ? '../assets/icons/folder_open_FILL0_wght400_GRAD0_opsz48.svg' : element.child
    img.style.objectFit = (isFolder) ? 'fill' : 'cover'
    label.textContent = element.label

    divInfo.appendChild(label)
    if (!isFolder) {
        divInfo.appendChild(divSelection)
    }


    div.appendChild(img)
    div.appendChild(divInfo)


    return div;
}

export async function loadGalleryItems(folder, item) {
    let path = item.getAttribute('path')
    await updateGalleryView(folder,item, path)
}

export async function onClickGalleryFolder(ev) {
    let path = ev.currentTarget.getAttribute('path')
    //setCurrentPath(ev.currentTarget)
    await updateTreeAndGalleryView(ev)
}

function convertPathIntoArray(path) {
    let pathArr = path.substring(1).split('/')
    return pathArr;
}



export function setCurrentPath(element) {
    currentPath = element.getAttribute('path')
    let currentPathArr = convertPathIntoArray(currentPath)

    $('.div-nav').empty()

    let tempPath = '';
    currentPathArr.forEach(path => {
        tempPath += `/${path}`
        let node = document.createElement('span')
        node.className = 'customized-span-tag'
        node.textContent = path;
        node.setAttribute('path', tempPath)
        let span = document.createElement('span')
        span.textContent = ' / '
        span.style.margin = '0 10px'
        $('.div-nav').append(node).append(span)
    })

}

async function updateGalleryView(folder, explorerElement, path) {
    $('.div-items').empty()
    if(path.includes('/root/')) path = path.slice(6)
    let data = await getExplorerData(folder,path)
    console.log(data)

    if (data.children instanceof Array) {
        for (const galleryItem of data.children) {
            let filePath =  `${path}/${galleryItem.label}`
            filePath = (filePath[0] === '/')? filePath.slice(1): filePath
            let isFileSelected = selectedFiles.includes(filePath)
            $('.div-items').append(createGalleryItem(galleryItem, path, isFileSelected, folder))
        }
    }

}


function getParentsPath(parent, child) {
    if (parent) {
        let p = (parent === '/')? 'root':parent
        let parents = $(`#ul-${p}`).parents()
        let path = `/${p}/${child}`
        for (const parent1 of Array.from(parents)) {
            if (parent1.id === 'root') break
            path = `/${parent1.id.substring(3)}${path}`
        }
        return path;
    } else {
        return `/${child}`
    }
}



