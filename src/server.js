const express = require('express')

const { MongoClient } = require('mongodb')

let users

const app = express()

app.use(express.json())

MongoClient.connect('mongodb://localhost:27017/teste').then((cli) => {
  users = cli.db().collection('users')

  app.listen(3000, () => {
    console.log('server on port 3000')
  })
}).catch((error) => {
  console.error(error)
})

// app.get('/home', (req, res) => {
//     console.log(req.url)

//     res.send('Karla\' Home')
// })

// app.post('/home', (req, res) => {
//     console.log(req.body)

//     res.send('Vitória\' Home')
// })

// if (typeof req.body.username !== 'string' || typeof req.body.password !== 'string' || typeof req.body.email !== 'string'){
//     res.status(400).send('Parâmetros inválidos')
//     return
// }

// if (typeof req.body.username !== 'string' || typeof req.body.password !== 'string' || typeof req.body.email !== 'string'){
//     res.status(400).send('Parâmetros inválidos')
//     return
// }

// if (req.body.username !== username || req.body.password !== password){
//     res.status(400).send('Dados de login incorretos!')
//     return
// }

app.post('/login', (req, res) => {
  console.log(req.body)

  if (typeof req.body.username !== 'string' || typeof req.body.password !== 'string') {
    res.status(400).send('Parâmetros inválidos')
    return
  }

  users.findOne({ username: req.body.username }).then((result) => {
    if (result === null) {
      res.status(400).send('Usuário inexistente!')

      return
    }

    if (result.password !== req.body.password) {
      res.status(400).send('Senha inválida!')

      return
    }

    res.send('Ok!')
  }).catch(() => {
    res.send('Error')
  })
})

app.post('/user', (req, res) => {
  console.log(req.body)

  const requiresFields = ['username', 'email', 'password', 'passwordConfirmation']

  for (const key of requiresFields) {
    if (typeof req.body[key] !== 'string') {
      res.status(400).send(`Parâmetro inválido: ${key}`)
      return
    }
  }

  if (req.body.password !== req.body.passwordConfirmation) {
    res.status(400).send('Confirmação de senha incorreta!')
    return
  }

  users.findOne({ username: req.body.username }).then((result) => {
    console.log(result)
    if (result !== null) {
      res.status(400).send('Usuário já existente!')

      return
    }

    users.insertOne({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    }).then((result) => {
      res.send('Ok')
    }).catch(() => {
      res.send('Error')
    })
  }).catch(() => {
    res.send('Error')
  })

  // users.push({
  //   username: req.body.username,
  //   email: req.body.email,
  //   password: req.body.password
  // })
})

app.put('/user/:id', (req, res) => { // req - requisição (é o q o usuario mandou ao servidor) e o res - resposta (resposta do servidor ao usuario)   => (arrow function - função)
  // console.log(req.params.id)

  if (req.body.password === '') {
    res.status(400).send('Senha inválida')
    return
  }

  // users.forEach((user) => { //user - é o usuário que será rodado
  //     if (user.username === req.params.id) { //
  //         user.password = req.body.password //depois de achar o usuário, será possível mudar a senha, user.password (senha atual) será substituída pela nova senha atribuida ao req.body.password
  //         res.send(`Atualizar senha ${req.params.id}`)
  //     }
  // })
  // res.status(400).send(`Usuário não encontrado`)

  // const index = users.findIndex((user) => {
  //   return user.username === req.params.id
  // })

  users.updateOne({ username: req.params.id }, { $set: { password: req.body.password } }).then((result) => {
    if (result.matchedCount === 0) {
      res.status(400).send('Usuário não encontrado!')
      return
    }
    res.send(`Atualizar senha de ${req.params.id}`)
  }).catch(() => {
    res.send('Error!')
  })
})

app.delete('/user/:id', (req, res) => {
  // const index = users.findIndex((user) => { // index - indice do array (posição do elemtno no array)
  //   return user.username === req.params.id
  // })

  // if (index === -1) {
  //   res.status(400).send('Usuário não encontrado!')
  // }

  // users[index].username = req.params.id
  // users.splice(index, 1) // splice - vai cortar um pedaço do array

  users.deleteOne({ username: req.params.id }).then((result) => {
    if (result.deletedCount === 0) {
      res.status(400).send('Usuário não encontrado!')
      return
    }
    res.send(`O usuário ${req.params.id} foi deletado`)
  }).catch(() => {
    res.send('Error!')
  })
})

app.get('/user', (req, res) => {
  // res.json(users)
  const cursor = users.find()
  cursor.toArray().then((result) => {
    res.json(result)
  }).catch(() => {
    res.send('Error!')
  })
})
