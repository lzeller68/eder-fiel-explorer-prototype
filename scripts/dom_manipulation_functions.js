import {selectedFiles} from '/index.js';
import {getExplorerData} from "./api_services.js";
import {convertPathToArray, getIdNameForElement} from "./helpers.js";

let currentPath = '';

export function onChangeGalleryItemSelection(ev) {
    let isSelected = (ev.currentTarget.getAttribute('is-selected') === 'true')
    ev.currentTarget.setAttribute('is-selected', !isSelected)
    isSelected = (ev.currentTarget.getAttribute('is-selected') === 'true')
    let path = ev.currentTarget.getAttribute('path')
    let rootFolder = ev.currentTarget.getAttribute('root-folder')

    if (isSelected) {
        path = (path[0] === '/')? path.slice(1): path;
        if(!selectedFiles.includes(path)){
            selectedFiles.push(path)
            console.log(selectedFiles)
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

export function createListItem(folder, element, currentPath) {
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


    li.setAttribute('path', currentPath)

    let idPath = getIdNameForElement(currentPath)
    li.setAttribute('id', `li${idPath}`)
    li.setAttribute('root-folder', folder)
    return li;
}



export function createUnorderedList(folder, element, path) {
    let idPath = getIdNameForElement(path)
    let ul = document.createElement('ul')
    let lbl = (element.label === '/')? 'root': element.label
    ul.setAttribute('id', `ul${idPath}`)
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


export async function updateExplorerGallery(liElement) {
    let rootFolder = liElement.getAttribute('root-folder')
    let path = liElement.getAttribute('path')

    $('.div-items').empty()

    let data = await getExplorerData(rootFolder,path)

    if (data.children instanceof Array) {
        for (const galleryItem of data.children) {
            let filePath =  `${path}/${galleryItem.label}`
            filePath = (filePath[0] === '/')? filePath.slice(1): filePath
            let isFileSelected = selectedFiles.includes(filePath)
            $('.div-items').append(createGalleryItem(galleryItem, path, isFileSelected, rootFolder))
        }
    }

}


export function updateCurrentPath(path){
    console.warn('----UPDATE CURRENT PATH')
    console.warn(path)

    let pathArr = convertPathToArray(path)
    console.warn(pathArr)

    let spanUrl = document.createElement('span')
    spanUrl.setAttribute('id', 'span-url')
    pathArr.forEach(p => {
        let span = document.createElement('span')
        let spacer = document.createTextNode(' / ')
        span.textContent = p;
        spanUrl.appendChild(span)
        spanUrl.appendChild(spacer)
    })

    $('.div-nav').empty().append(spanUrl)
}


