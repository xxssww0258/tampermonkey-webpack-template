import React, { useState } from 'react'

export function Bpp() {
    const [count, setCount] = useState<number>(0)
    return (
        <>
            <div>{count}</div>
            <button onClick={() => setCount(count + 1)}>add</button>
        </>
    )
}
