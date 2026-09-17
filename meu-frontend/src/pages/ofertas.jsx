import { Link } from 'react-router-dom'

export default function OfertasPage() {
  return (
    <main className='app'>
      <section className='page-section'>
        <span className='section-label'>OFERTAS</span>
        <h1>Ofertas</h1>
        <p>Confira as ofertas da semana para viajar com conforto.</p>
        <Link className='back-link' to='/'>Voltar ao início</Link>
      </section>
    </main>
  )
}
