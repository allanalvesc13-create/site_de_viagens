import { Link } from 'react-router-dom'

export default function DestinosPage() {
  return (
    <main className='app'>
      <section className='page-section'>
        <span className='section-label'>EXPLORE</span>
        <h1>Destinos</h1>
        <p>Encontre os melhores destinos para sua próxima viagem.</p>
        <Link className='back-link' to='/'>Voltar ao início</Link>
      </section>
    </main>
  )
}
