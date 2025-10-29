import { type ReactElement, useMemo } from 'react'
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useAccount,
  useIsAuthenticated,
  useMsal,
} from '@azure/msal-react'
import {
  InteractionStatus,
  type AuthenticationResult,
} from '@azure/msal-browser'
import { Navigate, Route, Routes, Link } from 'react-router-dom'
import './App.css'
import {
  b2cPolicies,
  hasValidCriticalConfig,
  loginRequest,
  missingCriticalKeys,
} from './authConfig'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/callback"
        element={
          <RequireAuth>
            <CallbackPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function HomePage() {
  const { instance, accounts } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const account = useMemo(
    () => (accounts.length ? accounts[0] : undefined),
    [accounts],
  )

  const handleLogin = async () => {
    if (!hasValidCriticalConfig) {
      console.error('Eksik konfigürasyon değerleri', missingCriticalKeys)
      return
    }

    await instance.loginRedirect(loginRequest)
  }

  const handleLogout = async () => {
    await instance.logoutRedirect({
      account,
    })
  }

  const handleAcquireToken = async () => {
    if (!hasValidCriticalConfig) {
      console.error('Eksik konfigürasyon değerleri', missingCriticalKeys)
      return
    }

    try {
      const response: AuthenticationResult =
        await instance.acquireTokenSilent({
          ...loginRequest,
          account: account ?? accounts[0],
        })
      console.info('Access token acquired', response.accessToken)
    } catch (error) {
      console.warn('Falling back to interactive token acquisition', error)
      await instance.acquireTokenRedirect(loginRequest)
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Microsoft Entra ID (B2C) Demo</h1>
        <p className="subtitle">
          Yerel ortamda oturum açma/çıkış akışı için MSAL + React örneği
        </p>
        {!hasValidCriticalConfig && (
          <div className="config-warning" role="alert">
            <strong>MSAL yapılandırması eksik:</strong>{' '}
            {missingCriticalKeys.join(', ')} değerlerini `.env` dosyanızda
            doldurun. Değerler tanımlandıktan sonra uygulamayı yeniden
            başlatmanız gerekir.
          </div>
        )}
      </header>

      <section className="actions">
        {!isAuthenticated ? (
          <button
            className="primary-btn"
            onClick={handleLogin}
            disabled={!hasValidCriticalConfig}
          >
            Oturum Aç
          </button>
        ) : (
          <div className="auth-actions">
            <button className="secondary-btn" onClick={handleAcquireToken}>
              Korumalı İçeriği Getir
            </button>
            <button className="primary-btn" onClick={handleLogout}>
              Oturumu Kapat
            </button>
          </div>
        )}
      </section>

      <section className="status">
        <h2>Durum</h2>
        <p>
          Oturum durumu:{' '}
          <strong>{isAuthenticated ? 'Doğrulandı' : 'Anonim'}</strong>
        </p>
        <p>
          Aktif kullanıcı:{' '}
          <strong>{account?.username ?? 'Kullanıcı bulunamadı'}</strong>
        </p>
      </section>

      <section className="protected">
        <h2>Korumalı Sayfa</h2>
        <AuthenticatedTemplate>
          <ProfileCard />
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <p>Korumalı içeriğe erişmek için oturum açmanız gerekiyor.</p>
        </UnauthenticatedTemplate>
      </section>

      <section className="config-hint">
        <h2>Yapılandırma</h2>
        <ul>
          <li>
            Tenant: <code>{b2cPolicies.tenantDomain || 'Tanımlanmadı'}</code>
          </li>
          <li>
            User Flow: <code>{b2cPolicies.names.signUpSignIn || '-'}</code>
          </li>
          <li>
            Authority:{' '}
            <code>{b2cPolicies.authorities.signUpSignIn.authority}</code>
          </li>
        </ul>
        <Link className="link-btn" to="/callback">
          Korumalı Sayfayı Aç
        </Link>
      </section>
    </div>
  )
}

function CallbackPage() {
  const { instance, accounts } = useMsal()
  const account = useAccount(accounts[0] ?? null)
  const postLogoutRedirectUri =
    import.meta.env.VITE_POST_LOGOUT_REDIRECT_URI ?? window.location.origin

  const handleLogout = async () => {
    await instance.logoutRedirect({
      account: accounts[0],
      postLogoutRedirectUri,
    })
  }

  const displayName =
    account?.name ||
    account?.idTokenClaims?.['name'] ||
    account?.username ||
    'Oturum açmış kullanıcı'

  return (
    <div className="callback-container">
      <header className="callback-header">
        <h1>Korumalı Alan</h1>
        <p>
          Bu sayfa yalnızca Microsoft Entra ID üzerinden oturum açtıktan sonra
          erişilebilir.
        </p>
        <p className="callback-greeting">Hoş geldin, {displayName}!</p>
      </header>

      <section className="callback-profile">
        <ProfileCard />
      </section>

      <section className="callback-actions">
        <button className="primary-btn" onClick={handleLogout}>
          Oturumu Kapat
        </button>
        <Link className="link-btn" to="/">
          Ana Sayfaya Dön
        </Link>
      </section>
    </div>
  )
}

function RequireAuth({ children }: { children: ReactElement }) {
  const isAuthenticated = useIsAuthenticated()
  const { inProgress } = useMsal()

  if (
    inProgress === InteractionStatus.Startup ||
    inProgress === InteractionStatus.HandleRedirect
  ) {
    return (
      <div className="callback-container">
        <p>Kimlik doğrulama tamamlanıyor...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

function ProfileCard() {
  const { accounts } = useMsal()
  const account = useAccount(accounts[0] ?? null)

  if (!account) {
    return null
  }

  const claims = account.idTokenClaims as Record<string, unknown> | undefined

  const pickString = (value: unknown): string | undefined => {
    if (typeof value === 'string') {
      return value
    }

    if (Array.isArray(value)) {
      const firstString = value.find(
        (item): item is string => typeof item === 'string',
      )
      return firstString
    }

    return undefined
  }

  const name =
    pickString(claims?.['name']) ?? account.name ?? 'İsimsiz kullanıcı'
  const email =
    pickString(claims?.['emails']) ??
    pickString(claims?.['email']) ??
    account.username
  const objectId = pickString(claims?.['oid']) ?? 'N/A'

  return (
    <div className="profile-card">
      <h3>Profil Bilgileri</h3>
      <dl>
        <div className="profile-row">
          <dt>Ad</dt>
          <dd>{name}</dd>
        </div>
        <div className="profile-row">
          <dt>E-posta</dt>
          <dd>{email}</dd>
        </div>
        <div className="profile-row">
          <dt>OID</dt>
          <dd>{objectId}</dd>
        </div>
      </dl>
    </div>
  )
}

export default App
