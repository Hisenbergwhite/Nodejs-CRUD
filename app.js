const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const { param } = require('express/lib/request')

const app = express()
const port = process.env.PORT || 5000
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// MYSQL
const pool=mysql.createPool({
    connectionLimit:10,
    host:'localhost',
    user:'root',
    password:'12345',
    database:'emplyoee_details'
})


//Displaying all the records from the table by ID
app.get('',(req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('SELECT * from details', (err, rows) => {
            connection.release() // return the connection to pool
            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})

//Select a record by id
app.get('/:id',(req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('SELECT * from details WHERE id=?',[req.params.id],(err, rows) => {
            connection.release() // return the connection to pool
            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})

//delete a record by id


app.delete('/:id',(req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('DELETE from details WHERE id = ?',[req.params.id],(err, rows) => {
            connection.release() // return the connection to pool
            if(!err) {
                res.send(`Details in the rocord ID:${[req.params.id]} has been removed`)
            } else {
                console.log(err)
            }
        })
    })
})

//add an row in Table
app.post('', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)
        const params = req.body
        connection.query('INSERT INTO details SET ?', params, (err, rows) => {
            connection.release() // return the connection to pool
            if(!err) {
                res.send(`details with the Name: ${params.name} has been added`)
            } else {
                console.log(err)
             }
        })
        console.log(req.body)
    })
 })
//update the table
app.put('', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
         console.log( `connected as id ${connection.threadId}`)
        const { id, name, phno, email, desgination } = req.body
        connection.query('UPDATE details SET name = ?, phno = ?, email = ?, desgination = ? WHERE id = ?', [name, phno,
        email, desgination, id], (err, rows) => {
            connection.release() // return the connection to pool
            if(!err) {
                res.send( `details with the name: ${name} has been added.`)
              } else {
                 console.log(err)
              }
        })
        console.log(req.body)
    })
})



// Listen on enviroment port or 5000


app.listen(port, () => console.log( `Listen on port ${port}`))