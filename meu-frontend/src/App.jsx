import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const API_URL = 'http://127.0.0.1:8000/api/auth';
const TRIPS_API_URL = 'http://127.0.0.1:8000/api/trips/';
const LOCATIONS_API_URL =
  'https://servicodados.ibge.gov.br/api/v1/localidades/estados';

function Navigation({ user, onLogout }) {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('Início');

  const menus = [
    { label: 'Início', path: '/' },
    { label: 'Destinos', path: '/destinos' },
    { label: 'Passagens', path: '/passagens' },
    { label: 'Ofertas', path: '/ofertas' },
    { label: 'Serviços', path: '/servicos' },
    { label: 'Sobre nós', path: '/sobre' },
  ];

  return (
    <header className="navbar">

      <div className="logo">
        <div className="logo-symbol">B</div>

        <div>
          <strong>AlvesViagens</strong>
          <span>VIAGENS</span>
        </div>
      </div>

      <nav className="navigation">
        {menus.map((menu) => (
          <button
            key={menu.label}
            className={activeMenu === menu.label ? 'active' : ''}
            onClick={() => {
              setActiveMenu(menu.label);
              navigate(menu.path);
            }}
          >
            {menu.label}
          </button>
        ))}
      </nav>

      <div className="navbar-actions">
        {user && (
          <span className="my-trips">
            🎟 Minhas viagens
          </span>
        )}

        {user ? (
          <button className="login-button" onClick={onLogout}>
            Sair
          </button>
        ) : (
          <button
            className="login-button"
            onClick={() => {
              document
                .getElementById('login')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            👤 Entrar
          </button>
        )}
      </div>

    </header>
  );
}

function App() {
  const [authMode, setAuthMode] = useState('login');

  const [authForm, setAuthForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [user, setUser] = useState(null);
  const [authMessage, setAuthMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [trips, setTrips] = useState([]);

  // API DO IBGE
  const [states, setStates] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);

  const [selectedState, setSelectedState] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState('');

  const [destinationSearch, setDestinationSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // =========================
  // CARREGAR VIAGENS
  // =========================

  function loadTrips() {
    fetch(TRIPS_API_URL)
      .then((result) => result.json())
      .then((data) => {
        setTrips(data.trips || []);
      })
      .catch((error) => {
        console.error('Erro ao carregar viagens:', error);
      });
  }

  // =========================
  // CARREGAR USUÁRIO + IBGE
  // =========================

  useEffect(() => {
    fetch(`${API_URL}/me/`, {
      credentials: 'include',
    })
      .then((result) => (result.ok ? result.json() : null))
      .then((data) => {
        if (data) {
          setUser(data.user);
        }
      })
      .catch(() => {});

    loadTrips();

    // API DO IBGE - ESTADOS
    fetch(`${LOCATIONS_API_URL}?orderBy=nome`)
      .then((result) => result.json())
      .then((data) => {
        setStates(data);
      })
      .catch((error) => {
        console.error('Erro ao carregar estados:', error);
      });
  }, []);

  // =========================
  // API DO IBGE - MUNICÍPIOS
  // =========================

  useEffect(() => {
    if (!selectedState) {
      setMunicipalities([]);
      return;
    }

    fetch(
      `${LOCATIONS_API_URL}/${selectedState}/municipios?orderBy=nome`
    )
      .then((result) => result.json())
      .then((data) => {
        setMunicipalities(data);
      })
      .catch((error) => {
        console.error('Erro ao carregar municípios:', error);
      });
  }, [selectedState]);

  // =========================
  // LOGIN / CADASTRO
  // =========================

  function updateField(event) {
    setAuthForm({
      ...authForm,
      [event.target.name]: event.target.value,
    });
  }

  function handleStateChange(event) {
    setSelectedState(event.target.value);
    setSelectedMunicipality('');
  }

  async function handleAuth(event) {
    event.preventDefault();

    setIsSubmitting(true);
    setAuthMessage('');

    const endpoint =
      authMode === 'login' ? 'login' : 'register';

    try {
      const result = await fetch(
        `${API_URL}/${endpoint}/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(authForm),
        }
      );

      const data = await result.json();

      if (!result.ok) {
        throw new Error(
          data.error || 'Não foi possível concluir o acesso.'
        );
      }

      setUser(data.user);

      setAuthForm({
        username: '',
        email: '',
        password: '',
      });

      setAuthMessage(
        authMode === 'login'
          ? 'Login realizado com sucesso.'
          : 'Conta criada com sucesso.'
      );
    } catch (error) {
      setAuthMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogout() {
    await fetch(`${API_URL}/logout/`, {
      method: 'POST',
      credentials: 'include',
    });

    setUser(null);
    setAuthMessage('Você saiu da sua conta.');
  }

  // =========================
  // FILTRO DAS VIAGENS
  // =========================

  const visibleTrips = trips.filter((trip) => {
    const destination =
      trip.destination?.toLowerCase() || '';

    const search =
      destinationSearch.toLowerCase();

    const state =
      selectedState.toLowerCase();

    const municipality =
      selectedMunicipality.toLowerCase();

    const price = Number(trip.price);

    const matchesDestination =
      destination.includes(search);

    const matchesState =
      !state || destination.includes(state);

    const matchesMunicipality =
      !municipality ||
      destination.includes(municipality);

    const matchesPrice =
      !maxPrice || price <= Number(maxPrice);

    const matchesDate =
      !selectedDate ||
      trip.departure_date === selectedDate;

    return (
      matchesDestination &&
      matchesState &&
      matchesMunicipality &&
      matchesPrice &&
      matchesDate
    );
  });

  // =========================
  // DESTINOS VISUAIS
  // =========================

  const destinations = [
    {
      name: 'Belém - PA',
      price: 'R$ 50,00',
      image:
        'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Marabá - PA',
      price: 'R$ 120,00',
      image:
        'https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Salinópolis - PA',
      price: 'R$ 80,00',
      image:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Santarém - PA',
      price: 'R$ 110,00',
      image:
        'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <main className="app">

      {/* =========================
          MENU
      ========================= */}

      <Navigation
        user={user}
        onLogout={handleLogout}
      />

      {/* =========================
          HERO
      ========================= */}

      <section className="hero">

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <span className="hero-tag">
            ✦ VIAJE COM A AlvesViagens
          </span>

          <h1>
            Sua próxima viagem
            <br />
            <span>começa aqui.</span>
          </h1>

          <p>
            Conforto, segurança e praticidade para
            você chegar ao seu destino com tranquilidade.
          </p>

        </div>

        {/* =========================
            BUSCA
        ========================= */}

        <div className="search-container">

          <div className="search-field">
            <span className="field-icon">📍</span>

            <div>
              <label>Para onde?</label>

              <input
                type="text"
                placeholder="Cidade de destino"
                value={destinationSearch}
                onChange={(event) =>
                  setDestinationSearch(event.target.value)
                }
              />
            </div>
          </div>

          {/* ESTADO - API IBGE */}

          <div className="search-field">

            <span className="field-icon">🇧🇷</span>

            <div>
              <label>Estado</label>

              <select
                value={selectedState}
                onChange={handleStateChange}
              >
                <option value="">
                  Todos os estados
                </option>

                {states.map((state) => (
                  <option
                    value={state.sigla}
                    key={state.id}
                  >
                    {state.nome} ({state.sigla})
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* MUNICÍPIO - API IBGE */}

          <div className="search-field">

            <span className="field-icon">📌</span>

            <div>
              <label>Município</label>

              <select
                value={selectedMunicipality}
                onChange={(event) =>
                  setSelectedMunicipality(
                    event.target.value
                  )
                }
                disabled={!selectedState}
              >
                <option value="">
                  Todos os municípios
                </option>

                {municipalities.map((municipality) => (
                  <option
                    value={municipality.nome}
                    key={municipality.id}
                  >
                    {municipality.nome}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* DATA */}

          <div className="search-field">

            <span className="field-icon">📅</span>

            <div>
              <label>Data da viagem</label>

              <input
                type="date"
                value={selectedDate}
                onChange={(event) =>
                  setSelectedDate(event.target.value)
                }
              />
            </div>

          </div>

          {/* PREÇO */}

          <div className="search-field price-field">

            <span className="field-icon">💰</span>

            <div>
              <label>Preço máximo</label>

              <input
                type="number"
                min="0"
                placeholder="R$ 0,00"
                value={maxPrice}
                onChange={(event) =>
                  setMaxPrice(event.target.value)
                }
              />
            </div>

          </div>

          <button
            className="search-button"
            type="button"
            onClick={() => {
              document
                .getElementById('trips')
                ?.scrollIntoView({
                  behavior: 'smooth',
                });
            }}
          >
            🔎 Buscar
          </button>

        </div>

      </section>

      {/* =========================
          BENEFÍCIOS
      ========================= */}

      <section className="benefits">

        <div className="benefit">
          <div className="benefit-icon">📍</div>

          <div>
            <strong>Vários destinos</strong>
            <span>Em todo o Brasil</span>
          </div>
        </div>

        <div className="benefit">
          <div className="benefit-icon">🚌</div>

          <div>
            <strong>Ônibus confortáveis</strong>
            <span>Viaje com tranquilidade</span>
          </div>
        </div>

        <div className="benefit">
          <div className="benefit-icon">🛡️</div>

          <div>
            <strong>Segurança garantida</strong>
            <span>Em todas as viagens</span>
          </div>
        </div>

        <div className="benefit">
          <div className="benefit-icon">🎧</div>

          <div>
            <strong>Atendimento</strong>
            <span>Estamos aqui para ajudar</span>
          </div>
        </div>

      </section>

      {/* =========================
          DESTINOS
      ========================= */}

      <section className="destinations-section">

        <div className="section-heading">

          <div>
            <span className="section-label">
              EXPLORE
            </span>

            <h2>Destinos populares</h2>
          </div>

          <button>Ver todos →</button>

        </div>

        <div className="destinations-grid">

          {destinations.map((destination) => (
            <article
              className="destination-card"
              key={destination.name}
            >

              <img
                src={destination.image}
                alt={destination.name}
              />

              <div className="destination-overlay"></div>

              <div className="destination-info">

                <h3>{destination.name}</h3>

                <p>
                  A partir de{' '}
                  <strong>{destination.price}</strong>
                </p>

              </div>

            </article>
          ))}

        </div>

      </section>

      <section
        className="trips-section"
        id="trips"
      >

        <div className="section-heading">

          <div>
            <span className="section-label">
              ENCONTRE SUA VIAGEM
            </span>

            <h2>Viagens disponíveis</h2>
          </div>

          <span className="results-count">
            {visibleTrips.length} encontrada(s)
          </span>

        </div>

        <div className="trip-list">

          {visibleTrips.length ? (
            visibleTrips.map((trip) => (

              <article
                className="trip-card"
                key={trip.id}
              >

                <div className="trip-top">
                  <span className="offer-tag">
                    ✦ DISPONÍVEL
                  </span>
                </div>

                <h3>{trip.title}</h3>

                <p className="trip-destination">
                  📍 {trip.destination}
                </p>

                <p className="trip-description">
                  {trip.description ||
                    'Uma experiência inesquecível espera por você.'}
                </p>

                <div className="trip-details">

                  <span>
                    📅{' '}
                    {new Date(
                      `${trip.departure_date}T00:00:00`
                    ).toLocaleDateString('pt-BR')}
                  </span>

                  <strong>
                    R${' '}
                    {Number(trip.price)
                      .toFixed(2)
                      .replace('.', ',')}
                  </strong>

                </div>

                <button className="trip-button">
                  Ver viagem →
                </button>

              </article>

            ))
          ) : (

            <div className="empty-state">
              <div>🚌</div>

              <h3>
                Nenhuma viagem encontrada
              </h3>

              <p>
                Tente alterar os filtros da sua busca.
              </p>

            </div>

          )}

        </div>

      </section>

      <section className="services">

        <div className="service">
          <div className="service-icon">📦</div>

          <div>
            <h3>Encomendas</h3>
            <p>
              Envie suas encomendas com segurança
              e rapidez.
            </p>
            <button>Saiba mais →</button>
          </div>
        </div>

        <div className="service">
          <div className="service-icon">👥</div>

          <div>
            <h3>Fretamento</h3>
            <p>
              Fretamento para empresas, eventos
              e turismo.
            </p>
            <button>Saiba mais →</button>
          </div>
        </div>

        <div className="service">
          <div className="service-icon">🎟️</div>

          <div>
            <h3>Passagens promocionais</h3>
            <p>
              Aproveite nossas ofertas e economize.
            </p>
            <button>Ver ofertas →</button>
          </div>
        </div>

        <div className="service">
          <div className="service-icon">🎧</div>

          <div>
            <h3>Atendimento</h3>
            <p>
              Tire suas dúvidas e peça ajuda.
            </p>
            <button>Fale conosco →</button>
          </div>
        </div>

      </section>

      <section className="how-it-works">

        <div className="section-heading centered">

          <div>
            <span className="section-label">
              SIMPLES E RÁPIDO
            </span>

            <h2>Como funciona?</h2>
          </div>

        </div>

        <div className="steps">

          <div className="step">
            <span>01</span>
            <div>
              <h3>Busque sua viagem</h3>
              <p>
                Informe origem, destino e data.
              </p>
            </div>
          </div>

          <div className="step">
            <span>02</span>
            <div>
              <h3>Escolha sua viagem</h3>
              <p>
                Encontre a melhor opção para você.
              </p>
            </div>
          </div>

          <div className="step">
            <span>03</span>
            <div>
              <h3>Faça seu pagamento</h3>
              <p>
                Escolha uma forma de pagamento.
              </p>
            </div>
          </div>

          <div className="step">
            <span>04</span>
            <div>
              <h3>Receba sua passagem</h3>
              <p>
                Sua passagem ficará disponível.
              </p>
            </div>
          </div>

        </div>

      </section>

      {/* =========================
          LOGIN / CADASTRO
      ========================= */}

      <section
        className="auth-section"
        id="login"
      >

        {user ? (

          <div className="logged-in">

            <div>
              <span className="section-label">
                MINHA CONTA
              </span>

              <h2>
                Olá, {user.username}!
              </h2>

              <p>
                Sua conta está conectada.
              </p>
            </div>

            <button
              className="btn-secondary"
              onClick={handleLogout}
            >
              Sair da conta
            </button>

          </div>

        ) : (

          <div className="auth-box">

            <div className="auth-tabs">

              <button
                className={
                  authMode === 'login'
                    ? 'selected'
                    : ''
                }
                onClick={() =>
                  setAuthMode('login')
                }
              >
                Entrar
              </button>

              <button
                className={
                  authMode === 'register'
                    ? 'selected'
                    : ''
                }
                onClick={() =>
                  setAuthMode('register')
                }
              >
                Criar conta
              </button>

            </div>

            <h2>
              {authMode === 'login'
                ? 'Acesse sua conta'
                : 'Crie sua conta'}
            </h2>

            <form
              className="auth-form"
              onSubmit={handleAuth}
            >

              <input
                name="username"
                value={authForm.username}
                onChange={updateField}
                placeholder="Usuário"
                required
              />

              {authMode === 'register' && (
                <input
                  name="email"
                  type="email"
                  value={authForm.email}
                  onChange={updateField}
                  placeholder="E-mail"
                  required
                />
              )}

              <input
                name="password"
                type="password"
                value={authForm.password}
                onChange={updateField}
                placeholder="Senha"
                minLength={8}
                required
              />

              <button
                className="btn-primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Aguarde...'
                  : authMode === 'login'
                  ? 'Entrar'
                  : 'Cadastrar'}
              </button>

            </form>

            {authMessage && (
              <p className="auth-message">
                {authMessage}
              </p>
            )}

          </div>

        )}

      </section>

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="footer">

        <div className="logo footer-logo">
          <div className="logo-symbol">B</div>

          <div>
            <strong>ViaNova</strong>
            <span>VIAGENS</span>
          </div>
        </div>

        <p>
          Conforto, segurança e praticidade
          para sua viagem.
        </p>

        <span>
          © 2026 AlvesViagens
        </span>

      </footer>

    </main>
  );
}

export default App;