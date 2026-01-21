export type Products = {
  products: {
    edges: Array<{
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
