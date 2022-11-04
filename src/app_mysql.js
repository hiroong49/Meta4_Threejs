const express = require("express");
// require('dotenv').config();
const mysql = require("./mysql");
const sql = require('mysql');
const fs = require('fs');
const ejs = require('ejs');
const bodyParser = require('body-parser');

const app = express();

// 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));

const db = sql.createConnection ({
    connectionLimit: 10,
    host     : '127.0.0.1',
    user     : 'admin',
    password : '12341234',
    database : 'meta4db'
});

// 서버 실행
app.listen(3000, () => {
    // 3000번 포트로 실행
    console.log("Server started. port 3000");
});

app.get(["/gallery", "/gallery/:id"], function(req, res) {
    var id = req.params.id;

    fs.readFile('index.ejs' + id, 'utf-8', function (error, data) {
        db.query('select * from drawing where id=?', [
            id
        ], function (error, result) {            
            if (error) {                
                console.log("파일 가져올 때 에러 발생" + error);                
                return            
            }           
            res.send(ejs.render(data, {                
                data: result,
            }));
        });
    })
    // res.sendFile(__dirname + '/index.html');
});

