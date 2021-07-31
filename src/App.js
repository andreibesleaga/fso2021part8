import React, { useState } from 'react'
import { useQuery, useSubscription } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED } from './queries'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import EditAuthor from './components/EditAuthor'


const Notify = ({ errorMessage }) => {
  if ( !errorMessage ) {
    return null
  }
  return (
    <div style={{color: 'red'}}>
      {errorMessage}
    </div>
  )
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  var result_authors = useQuery(ALL_AUTHORS)
  var result_books = useQuery(ALL_BOOKS)

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      notify(`Book ${addedBook.title} added`)
      //result_books = useQuery(ALL_BOOKS)
    }
  })

  if (result_authors.loading || result_books.loading)  {
    return <div>loading...</div>
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  return (
    <div>
      <div>
        <Notify errorMessage={errorMessage} />
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>
      <Authors show={page === 'authors'} authors={result_authors.data.allAuthors} />
      <Books show={page === 'books'} books={result_books.data.allBooks} />
      <NewBook show={page === 'add'} setError={notify} />
      <EditAuthor setError={notify} />
    </div>
  )
}

export default App