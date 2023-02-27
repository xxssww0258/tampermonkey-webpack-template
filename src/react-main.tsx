import React from 'react'
import { createRoot } from 'react-dom/client'
import { Bpp } from './components/Bpp'

// Bpp
const bppEl = document.createElement('div')
bppEl.id = 'bpp'
document.body.insertBefore(bppEl, document.body.firstChild)

const root = createRoot(bppEl)
root.render(React.createElement(Bpp, null))
