const { pool }= require("../config/db");

async function createUser(username,passwordHash){
    await pool.query(
        `INSERT INTO users(username,password) VALUES ($1,$2)`,[username,passwordHash] 
    );
}

async function findUserByUsername(username){
    const result = await pool.query(
        `SELECT * FROM users WHERE username = $1`,[username]
    );
    //console.log(result);
    //if(!result.rows[0])console.log("niggga");
    return result.rows[0];
}

async function findUserById(id){
    const result = await pool.query(
        `SELECT * FROM users WHERE id = $1`,[id]
    );
    //if(!result.rows[0])console.log("niggga");
    console.log(result.rows[0]);
    return result.rows[0];
}


async function setAdmin(userId){
    await pool.query(
        `UPDATE users SET admin = 1 WHERE id = $1`,[userId]
    );
}

async function createForm(title,content,username){
    await pool.query(
        `INSERT INTO post(title,content,username) VALUES ($1,$2,$3)`,[title,content,username]
    );
}

async function callPost(){
    const postData = await pool.query(`SELECT * FROM post`);
    console.log(postData.rows);
    return postData.rows;
}

async function isadmin(userId) {
    const result = await pool.query(
        `SELECT * FROM users WHERE id = $1`,[userId]
    );
    console.log(result.rows[0].admin);
    if(result.rows[0].admin)return 1;
    else return 0;
}

//callPost();
//createUser("nikka","daf3424fk");


module.exports = {
    createUser,
    findUserByUsername,
    setAdmin,
    createForm,
    findUserById,
    callPost,
    isadmin
}