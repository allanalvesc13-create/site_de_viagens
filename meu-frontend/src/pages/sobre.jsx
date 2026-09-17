import { Link } from 'react-router-dom'

export default function SobrePage() {
  return (
    <main className='app'>
      <section className='page-section'>
        <span className='section-label'>SOBRE NÓS</span>
        <h1>Sobre nós</h1>
        <p>Somos uma agência de viagens focada em experiências simples, seguras e memoráveis.</p>
        <Link className='back-link' to='/'>Voltar ao início</Link>
      </section>
    </main>
  )
}
