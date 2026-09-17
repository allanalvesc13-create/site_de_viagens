import { Link } from 'react-router-dom'

export default function PassagensPage() {
  const destinos = [
    { id: 1, nome: 'São luis', preco: 500 },
    { id: 2, nome: 'Fortaleza', preco: 600 },
    { id: 3, nome: 'Salvador', preco: 700 },
    { id: 4, nome: 'Recife', preco: 800 },
    { id: 5, nome: 'Rio de Janeiro', preco: 900 },
  ]

  return (
    <main className='app'>
      <section className='page-section'>
        <span className='section-label'>PASSAGENS</span>
        <h1>Passagens</h1>
        <p>Compare opções e escolha a melhor passagem.</p>
        <Link className='back-link' to='/'>Voltar ao início</Link>
      </section>

      <div className='passagens-page'>
        <h1>Passagens</h1>
        <div className='trip-list'>
          {destinos.map((destino) => (
            <article className='trip-card' key={destino.id}>
              <h2>{destino.nome}</h2>
              <p>Passagem a partir de R$ {destino.preco.toFixed(2).replace('.', ',')}</p>
              <button className='trip-button' type='button'>
                Ver passagem
              </button>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
