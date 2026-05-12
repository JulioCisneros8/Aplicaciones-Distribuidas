import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function Saludo(props) {
  const [count, setCount] = useState(0)

  return (
    <>
        <div>
            <p>Buenos {props.tipo} {props.nombre}</p>
        </div>
    </>
  )
}

export default Saludo