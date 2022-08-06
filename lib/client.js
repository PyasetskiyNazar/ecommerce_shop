import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = sanityClient({
  projectId: 'ds9yp4sh',
  dataset: 'production',
  apiVersion: '2022-07-25',
  useCdn: true,
  token: process.env.API_TOKEN
})

const builder = imageUrlBuilder(client)

export const urlFor = (source) => builder.image(source)