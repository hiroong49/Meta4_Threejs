const mysql = require('mysql');
const sql = require('./sql.js');

// Connection Pool은 Connection을 미리 여러 개 만들어 pool에 보관하고 필요할 때마다 꺼내서 사용하고
// 사용이 끝나면 다시 Pool을 반환하는 방법. 
// Connection을 동시에 처리해 동접자가 많은 경우 서버를 좀 더 안정적으로 운영 가능
const pool = mysql.createPool({
    // connectionLimit: process.env.MYSQL_LIMIT,
    // host     : process.env.MYSQL_HOST,
    // user     : process.env.MYSQL_USERNAME,
    // password : process.env.MYSQL_PASSWORD,
    // database : process.env.MYSQL_DB
    connectionLimit: 10,
    host     : '127.0.0.1',
    user     : 'admin',
    password : '12341234',
    database : 'meta4DB'
});

const query = async (alias, values) => { // 쿼리 비동기 실행
    return new Promise((resolve, reject) => 
    pool.query(sql[alias], values, (error, results) => { // 쿼리문, 쿼리문으로 전달할 데이터 배열, 콜백 함수로 쿼리 결과 전달
        if (error) {
            console.log(error);
            reject({
                error
            });
        } else resolve(results);
    }));
}

module.exports = {
    query
};