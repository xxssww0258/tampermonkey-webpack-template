import './css/js.scss'

import avatorUrl from './img/avator.svg'

const appEl = document.createElement('div')
document.body.insertBefore(appEl, document.body.firstChild)

let count = 0
appEl.innerHTML = `<div class="jsDemo"> dmeo </div>
<img width="30" src="${avatorUrl}" />
<div id="countEl">${count}</div>
<button id="addBtn">add</button>
`

const countEl = document.querySelector('#countEl') as HTMLDivElement
const addBtn = document.querySelector('#addBtn')
addBtn?.addEventListener('click', function () {
    countEl.innerHTML = String((count += 1))
})

GM_setValue('whoAreYou', 'i am zhangsan')
const username = GM_getValue('whoAreYou')
console.log(username)
