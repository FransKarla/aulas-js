const express = require('express')

const app = express()

const users = []

app.use(express.json())

app.listen(3000, () => {
    console.log('server on port 3000')
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

    const result = users.find(element => {
        return element.username === req.body.username && element.password === req.body.password
    })

    if (typeof result === 'undefined') {
        res.status(400).send('usuário ou senha incorretos!')
        return
    }
    res.send('Ok')
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
        res.status(400).send(`Confirmação de senha incorreta!`)
        return
    }

    const result = users.find(user => {
        return user.username === req.body.username && user.email === req.body.email
    })

    if (typeof result !== 'undefined') {
        res.status(400).send('Usuário já existente!')
        return
    }

    users.push({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })

    res.send('Ok')
})

app.put('/user/:id', (req, res) => { //req - requisição (é o q o usuario mandou ao servidor) e o res - resposta (resposta do servidor ao usuario)   => (arrow function - função)
    // console.log(req.params.id)

    if (req.body.password === "") {
        res.status(400).send(`Senha inválida`)
        return
    }

    // users.forEach((user) => { //user - é o usuário que será rodado
    //     if (user.username === req.params.id) { //
    //         user.password = req.body.password //depois de achar o usuário, será possível mudar a senha, user.password (senha atual) será substituída pela nova senha atribuida ao req.body.password
    //         res.send(`Atualizar senha ${req.params.id}`)
    //     }
    // })
    // res.status(400).send(`Usuário não encontrado`)

    const index = users.findIndex((user) => {
        return user.username === req.params.id
    })

    if (index === -1) {
        res.status(400).send(`Usuário não encontrado`)
    }

    users[index].password = req.body.password
    res.send(`Atualizar senha de ${req.params.id}`)
})

app.delete('/user/:id', (req, res) => {

    const index = users.findIndex((user) => {   //index - indice do array (posição do elemtno no array)
        return user.username === req.params.id
    })

    if (index === -1) {
        res.status(400).send('Usuário não encontrado!')
    }

    users[index].username = req.params.id
    users.splice(index, 1) //splice - vai cortar um pedaço do array
    res.send(`O usuário ${req.params.id} foi deletado`)

});

app.get('/user', (req, res) => {

    res.json(users)
})

