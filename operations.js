import mysql from 'mysql2'

const connection=mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'yashu@123',
    database:'socialmedia'
}).promise()

export async function readposts(){
    const output = await connection.query("select * from posts")
    return output[0]
}

export async function readusers(profile){
    const output=await connection.query("select * from users where profile ='"+profile+"'")
    return output[0]
}

export async function insertusers(name,profile,password,headline){
    const output = await connection.query("insert into users (name,profile,password,headline) values('"+name+"','"+profile+"','"+password+"','"+headline+"')")
 }

 export async function insertposts(profile,content){
    const output = await connection.query("insert into posts (profile,content,likes,shares) values('"+profile+"','"+content+"',0,0)")
 }

 export async function likeFun(content){
    const output=await connection.query("select likes from posts where content='"+content+"'")
    const likes = output[0][0].likes  
    const inclikes = likes+1
    await connection.query("update posts set likes="+inclikes+" where content='"+content+"'")
 }
 export async function shareFun(content){
    const output=await connection.query("select shares from posts where content='"+content+"'")
    const shares = output[0][0].shares  
    const incshares = shares+1
    await connection.query("update posts set shares="+incshares+" where content='"+content+"'")
 }

 export async function deleteFun(content){
    await connection.query("delete from posts  where content='"+content+"'")
 }