import { Link } from 'react-router-dom'

export default function ServicosPage() {
  return (
    <main className='app'>
      <section className='page-section'>
        <span className='section-label'>SERVIÇOS</span>
        <h1>Serviços</h1>
        <p>Explore mais serviços para sua viagem com conforto e praticidade.</p>
        <Link className='back-link' to='/'>Voltar ao início</Link>
      </section>
    </main>
  )
}
