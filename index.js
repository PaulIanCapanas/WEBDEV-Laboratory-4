// import express from "express";
// import {Pool} from "pg";
// import path from "path";

const express = require("express");
const path = require("path");
const {Pool} = require("pg")

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "Manager",
    password: "postgres",
    port: 5432  
});


const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))
app.use(express.json())

app.post("/test", async(req,res) => {
    try {
        const client = await pool.connect()
        const content = req.body.content
        const result = await client.query(`insert into test(content) values($1) returning *`, [content])
        res.json(result)
    } catch (err) {
        console.log(err)
    }
}) 

app.get("/", (req, res) => {
  res.send("Succesful");
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "./index.html"));
});

app.get("/test", async(req, res) => {
    const client = await pool.connect()
    const result = await client.query("select * from test")
    res.json(result.rows)
});

app.delete("/test/:id", async(req, res) => {
    const client = await pool.connect()
    const id = req.params.id
    const result = await client.query("delete from test where id = $1", [id])
    res.status(200).send("content deleted successfully")
})

app.patch("/test/:user_id", async(req, res) => {
   try {
    const client = await pool.connect()
    const id = req.params.user_id
    const content = req.body.content
    const result = await client.query("update test set content = $1 where id = $2", [content, id])
    res.status(200).send("content patched succesfully")
   } catch (err) {
      console.log(err)
   }
})



app.listen(8080, () => {
  console.log("http://localhost:8080");
});

