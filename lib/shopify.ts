type ShopifyResponse<T> = {
  data?: T
  errors?: Array<{ message: string }>
}

const domain = process.env.SHOPIFY_STORE_DOMAIN
const apiVersion = process.env.SHOPIFY_API_VERSION ?? process.env.SHOPIFY_API_VRERSION
const storefrontToken =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ??
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLIC_TOKEN ??
  process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN

if (!domain) throw new Error('missing shopify store domain')
if (!apiVersion) throw new Error('missing shopify api version')
if (!storefrontToken) throw new Error('missing shopify storefront access token')

const shopifyEndPoint = `https://${domain}/api/${apiVersion}/graphql.json`

export const shopifyFetch = async <T>({
  query,
  variables,
  cache = 'force-cache',
  tags,
}: {
  query: string
  variables?: Record<string, unknown>
  cache?: RequestCache
  tags?: string[]
}): Promise<T> => {
  const res = await fetch(shopifyEndPoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
    cache,
    ...(tags && cache !== 'no-store' ? { next: { tags } } : {}),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Shopify fetch failed (${res.status}): ${text}`)
  }

  const json = (await res.json()) as ShopifyResponse<T>

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '))
  }
  if (!json.data) {
    throw new Error('Shopify response missing data')
  }

  return json.data
}
