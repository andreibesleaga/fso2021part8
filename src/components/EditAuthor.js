import React, { useState } from 'react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'
import { useMutation } from '@apollo/client'

const EditAuthor = (props) => {

  const [author, setAuthor] = useState('')
  const [born, setBorn] = useState('')

  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [  {query: ALL_AUTHORS} ],
    onError: (error) => {
        if(error && error.graphQLErrors && error.graphQLErrors[0] && error.graphQLErrors[0].message ) {
            props.setError(error.graphQLErrors[0].message)
        } else {
            props.setError('Error saving author born year')
        }
    }
  })

  const submit = async (event) => {
    event.preventDefault()    
    console.log('modifying author...')
    editAuthor({
      variables: { name:author, setBornTo:born }
    })
    setAuthor('')
    setBorn('')
  }


  return (
    <div>
      <form onSubmit={submit}>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type='submit'>modify author born year</button>
      </form>
    </div>
  )
}

export default EditAuthor