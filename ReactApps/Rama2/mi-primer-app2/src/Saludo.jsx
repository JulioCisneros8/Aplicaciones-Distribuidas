import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function Saludo() {
  const [count, setCount] = useState(0)

  return (
    <>
        <div>
            <p>Buenos días</p>
        </div>
    </>
  )
}

export default Saludo