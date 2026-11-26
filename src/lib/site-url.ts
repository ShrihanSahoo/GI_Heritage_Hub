/**
 * Returns the canonical base URL of the deployed site without a trailing slash.
 */
export function getSiteUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL;

  if (configured) {
    const withProtocol = configured.startsWith('http')
      ? configured
      : `https://${configured}`;
    return withProtocol.replace(/\/+$/, '');
  }

  return 'https://giheritagehub.vercel.app';
}
