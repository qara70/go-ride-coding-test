export const GET_PRODUCTS = `
  query {
    products(first: 10) {
      edges {
        node {
          id
          title
          images(first: 1) {
            edges {
              node {
                src
                altText
              }
            }
          }
          priceRangeV2 {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_FOR_UPDATE = `
  query {
    products(first: 10) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;

export const UPDATE_PRODUCT_TITLE = `
  mutation($input: ProductInput!) {
    productUpdate(input: $input) {
      product {
        id
        title
      }
    }
  }
`;

export const GET_PRODUCT_VARIANTS = `
  query {
    productVariants(first: 10) {
      edges {
        node {
          id
          displayName
          price
          image {
            altText
            url
          }
        }
      }
    }
  }
`;

export const UPDATE_PRODUCT_PRICE = `
  mutation ($input: ProductVariantInput!) {
    productVariantUpdate(input: $input) {
      product {
        id
      }
    }
  }`;
