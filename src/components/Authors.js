import React, { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { FIND_AUTHOR } from '../queries'

const Authors = (props) => {

  const [author, setAuthor] = useState(null)
  const [getAuthor, result] = useLazyQuery(FIND_AUTHOR)

  useEffect(() => {
    if (result.data) {
      setAuthor(result.data.allAuthors)
    }
  }, [result.data])

  if (!props.show) {
    return null
  }
  const authors = props.authors

  const showAuthor = (name) => {
    getAuthor({ variables: { nameToSearch: name } })
  }

  if (author) {
    return(
      <div>
        <h2>{author.name}</h2>
        <div>{author.born}</div>
        <div>{author.bookCount}</div>
        <button onClick={() => setAuthor(null)}>close</button>
      </div>
    )
  }
  
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}> 
              <td>{a.name} </td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Authors
