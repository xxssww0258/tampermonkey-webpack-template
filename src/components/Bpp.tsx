import React, { useState } from 'react'
import '../css/bpp.scss'
import avatorUrl from '../img/avator.svg'
export function Bpp() {
    const [count, setCount] = useState<number>(0)
    return (
        <>
            <div className="bpp">react demo</div>
            <img width="30" src={avatorUrl} alt="" srcset="" />
            <div>{count}</div>
            <button onClick={() => setCount(count + 1)}>add</button>
            <hr />
        </>
    )
}
