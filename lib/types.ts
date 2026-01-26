export type Products = {
  products: {
    pageInfo: {
      hasNextPage: boolean
      hasPreviousPage: boolean
      startCursor: string | null
      endCursor: string | null
    }
    edges: Array<{
      cursor: string
      node: {
        id: string
        handle: string
        title: string
        description: string
        featuredImage: null | {
          url: string
          altText: string | null
          width: number
          height: number
        }
        priceRange: {
          minVariantPrice: { amount: string; currencyCode: string }
        }
      }
    }>
  }
}
