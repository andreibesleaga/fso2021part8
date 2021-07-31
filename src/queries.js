import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors  {
      name
      born
      bookCount
    }
  }
`

export const FIND_AUTHOR = gql`
  query allAuthors($nameToSearch: String!) {
    allAuthors(name: $nameToSearch) {
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query {
    allBooks  {
      title
      published
      author
      genres
    }
  }
`

export const FIND_BOOKS_BYAUTHOR = gql`
  query allBooks($nameToSearch: String!) {
    allBooks(author: $nameToSearch) {
      title
      author
      published
      genres
    }
  }
`

export const FIND_BOOKS_BYGENRE = gql`
  query allBooks($genreToSearch: String!) {
    allBooks(genre: $genreToSearch) {
      title
      author
      published
      genres
    }
  }
`
export const ADD_BOOK = gql`
  mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String]!) {
    addBook( title: $title,  author: $author, published: $published,  genres: $genres ) {
      title,
      author
    }
  }
`

export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }
`

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    author
    published
    genres
  }
`
export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
${BOOK_DETAILS}
`
