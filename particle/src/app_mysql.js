const express = require("express");
// require('dotenv').config();
const mysql = require("./mysql");
const fs = require('fs');
const ejs = require('ejs');
const bodyParser = require('body-parser');

const app = express();

// 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));

// 서버 실행
app.listen(3000, () => {
    // 3000번 포트로 실행
    console.log("Server started. port 3000");
});

app.get("/gallery", function(req, res) {
    res.sendFile(__dirname + '/index.html');
    // console.log("get gallery 실행됨");
    // fs.readFile('index.html', function(error, data) {
    //     res.writeHead(200, { 'Content-Type': 'text/html' });
    //     res.end(data);
    //     console.log("get gallery 데이터 가져옴");
    // });
});

// 라우터 설정 
app.get("/api/gallery", async (req, res) => {
    try {
        console.log("get api gallery 실행됨");
        const drawings = await mysql.query('drawingList');
        console.log(drawings);
        res.send(drawings);
    } catch (error) {
        console.log(error);
    }
});
