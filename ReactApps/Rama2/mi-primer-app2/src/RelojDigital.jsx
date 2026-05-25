import { useState, useEffect } from 'react'

function RelojDigital() {
  const [hora, setHora] = useState(
    new Date().toLocaleTimeString()
  )

  useEffect(() => {
    const intervalo = setInterval(() => {
      setHora(new Date().toLocaleTimeString())
    }, 1000)

    return () => clearInterval(intervalo)
  }, [])

  return <p>Hora actual: {hora}</p>
}

export default RelojDigital