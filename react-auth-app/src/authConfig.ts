import type { Configuration, RedirectRequest } from '@azure/msal-browser'

console.log("!!! .env'den OKUNAN DEĞER: ", import.meta.env.VITE_SIGNIN_POLICY);

const tenantDomain = import.meta.env.VITE_TENANT_DOMAIN ?? ''
const signInPolicy = import.meta.env.VITE_SIGNIN_POLICY ?? ''
const clientId = import.meta.env.VITE_CLIENT_ID ?? ''

const tenantName = tenantDomain.endsWith('.onmicrosoft.com')
  ? tenantDomain.replace('.onmicrosoft.com', '')
  : tenantDomain

const authorityHost =
  import.meta.env.VITE_AUTHORITY_HOST ?? `${tenantName}.ciamlogin.com`

const authority =
  import.meta.env.VITE_AUTHORITY ??
  `https://${authorityHost}/${tenantDomain}/${signInPolicy}`

const redirectUri =
  import.meta.env.VITE_REDIRECT_URI ?? window.location.origin

const postLogoutRedirectUri =
  import.meta.env.VITE_POST_LOGOUT_REDIRECT_URI ?? window.location.origin

const apiScopes = import.meta.env.VITE_API_SCOPES
  ? import.meta.env.VITE_API_SCOPES.split(',').map((scope: string) =>
      scope.trim(),
    )
  : []

export const msalConfig: Configuration = {
  auth: {
    clientId,
    authority,
    knownAuthorities: [authorityHost],
    redirectUri,
    postLogoutRedirectUri,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
}

export const loginRequest: RedirectRequest = {
  scopes: ['openid', 'profile', ...apiScopes],
  authority,
}

export const b2cPolicies = {
  names: {
    signUpSignIn: signInPolicy,
  },
  authorities: {
    signUpSignIn: {
      authority,
    },
  },
  authorityDomain: authorityHost,
  tenantDomain,
}

const criticalConfig = {
  clientId,
  tenantDomain,
  signInPolicy,
}

export const missingCriticalKeys = Object.entries(criticalConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key)

export const hasValidCriticalConfig = missingCriticalKeys.length === 0
