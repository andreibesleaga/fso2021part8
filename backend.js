const { ApolloServer, gql } = require('apollo-server')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const uuid = require('uuid/v1')

let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's name in the context of the book instead of the author's id
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Romanian:
 * Ar fi mai logic sa asociem o carte cu autorul ei salvand numele autorului in loc de id autor in contextul cartii 
 * Totusi, pentru simplicitate, vom salva numele autorului in legatura cu cartea
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

const typeDefs = gql`
    type Author {
        name: String!
        born: Int
        bookCount: Int
        id: ID!
    }
    type Book {
        title: String!
        published: Int!
        author: String!
        id: ID!
        genres: [String]!
    }
    type Query {
        authorCount: Int!
        bookCount: Int!
        allAuthors(name:String): [Author]
        allBooks(author:String,genre:String): [Book]
    }
    type Mutation {
        addBook(
          title: String!
          author: String!
          published: Int!
          genres: [String]!
        ): Book
        editAuthor(
          name: String!
          setBornTo: Int
        ): Author
      }
      type Subscription {
        bookAdded: Book!
      }
`


const resolvers = {
    Query: {
        bookCount: () => books.length,
        authorCount: () => authors.length,
        allAuthors: (root, args) => {
            if(args.name) {
              const authorname = args.name
              return authors.find(a => a.name === authorname)
            }
            return authors.map(author => {
              let authorBooks = books.filter(book => book.author == author.name)
              return { ...author, bookCount:authorBooks.length }
            })
        },
        allBooks: (root, args) => {
            let responseBooks = books
            if (!args.author && !args.genre) {
                return responseBooks
            }
            if(args.author) {
                const author = args.author
                responseBooks = books.filter(book => book.author == author);
            }
            if(args.genre) {
                const genre = args.genre
                responseBooks = responseBooks.filter(book => book.genres.indexOf(genre)>-1);
            }
            return responseBooks
        }
    },
    Mutation: {
      addBook: (root, args) => {
          title = args.title
          authorname = args.author
          published = parseInt(args.published)
          genres = args.genres

        if (!authors.find(a => a.name === authorname)) {
            const author = { name:authorname, born:null, id:uuid() }
            authors = authors.concat(author)
        }
        const book = { title:title, author:authorname, published:published, genres:genres, id: uuid() }
        books = books.concat(book)
        pubsub.publish('BOOK_ADDED', { bookAdded: book })
        return book
      },
      editAuthor: (root, args) => {
        if(args.name && args.setBornTo) {
            const authorname = args.name
            const authorborn = parseInt(args.setBornTo)
            const author = authors.find(a => a.name === authorname)
            if (!author) {
              return null
            }
            const updatedAuthor = { ...author, born: authorborn }
            authors = authors.map(author => author.name === authorname ? updatedAuthor : author)
            return updatedAuthor
        } else {
            return null
        }
      }
    },
    Subscription: {
      bookAdded: {
        subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
      },
    }    
  }
  

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})