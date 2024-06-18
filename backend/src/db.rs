use std::error::Error;
use actix_web::{web, HttpResponse, Responder};
use mysql::{chrono, prelude::Queryable};
use mysql::Pool;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct Wish {
    id: i32,
    user_id: i32,
    text: String,
    timestamp: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewWish {
    text: String,
}

pub async fn create_database_and_table() -> Result<(), Box<dyn Error>> {
    let url = "mysql://root:root@localhost:3306";

    let pool = Pool::new(url)?;
    let mut conn = pool.get_conn()?;

    conn.query_drop("CREATE DATABASE IF NOT EXISTS my_database")?;

    let db_url = "mysql://root:root@localhost:3306/my_database";
    let db_pool = Pool::new(db_url)?;
    let mut db_conn = db_pool.get_conn()?;

    db_conn.query_drop(
        r"CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        )"
    )?;

    db_conn.query_drop(
        r"CREATE TABLE IF NOT EXISTS wishes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            text TEXT NOT NULL,
            timestamp DATETIME NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )"
    )?;

    Ok(())
}

pub async fn get_wishes(user_id: web::Path<i32>) -> impl Responder {
    let url = "mysql://root:root@localhost:3306/my_database";
    let pool = Pool::new(url).unwrap();
    let mut conn = pool.get_conn().unwrap();

    let query = "SELECT id, user_id, text, timestamp FROM wishes WHERE user_id = ?";
    match conn.exec_map(query, (user_id.into_inner(),), |(id, user_id, text, timestamp)| {
        Wish { id, user_id, text, timestamp }
    }) {
        Ok(result) => HttpResponse::Ok().json(result),
        Err(err) => HttpResponse::InternalServerError().body(format!("Error: {}", err)),
    }
}

pub async fn add_wish(user_id: web::Path<i32>, new_wish: web::Json<NewWish>) -> impl Responder {
    let url = "mysql://root:root@localhost:3306/my_database";
    let pool = Pool::new(url).unwrap();
    let mut conn = pool.get_conn().unwrap();

    match conn.exec_drop(
        "INSERT INTO wishes (user_id, text, timestamp) VALUES (?, ?, ?)",
        (user_id.into_inner(), new_wish.text.clone(), chrono::Utc::now().naive_utc())
    ) {
        Ok(_) => HttpResponse::Ok().json("Wish added"),
        Err(err) => HttpResponse::InternalServerError().body(format!("Error: {}", err)),
    }
}
