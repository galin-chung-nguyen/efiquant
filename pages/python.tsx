import { useEffect, useState } from 'react'
import Script from 'next/script'

export default function Home() {
    const [code, setCode] = useState("");
    const [pyodide, setPyodide] = useState(null);

    const pythonExec = async () => {
        let pyodide = await window.loadPyodide();
        setPyodide(pyodide)
    };

    const execCode = () => {
        if (pyodide) {
            // pyodide.runPython(`
            //     import sys
            //     sys.version
            // `)
            pyodide.runPython(code);
            setCode("");
        }
    }
    return (
        <>
            <Script
                src="https://cdn.jsdelivr.net/pyodide/v0.21.1/full/pyodide.js"
                onLoad={pythonExec}
            />

            <textarea value={code} onChange={e => setCode(e.target.value)}></textarea> <button onClick={execCode}>Run code</button>
        </>
    )
}