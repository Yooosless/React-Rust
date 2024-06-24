use serde::{Deserialize, Serialize};
use actix_web::{web, HttpResponse, Responder};
use mysql::prelude::Queryable;
use mysql::*;
use mysql::Pool;

use crate::create_jwt;

#[derive(Debug, Serialize, Deserialize,Clone)]
pub struct User{
    pub email: String,
    pub password: String,
    pub name: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoginResponse {
    pub token: String,
    pub user_id: u64,
    pub name: String,
}

pub async fn signup(user: web::Json<User>) -> impl Responder{
    let user= user.into_inner();
    if user.name.as_ref().map_or(true, |name| name.is_empty()) 
    || user.email.is_empty() 
    || user.password.is_empty() 
{
    return HttpResponse::BadRequest().body("Name, email, and password are required for signup and cannot be empty");
}
    let name = user.name.clone().unwrap();
    let email = user.email.clone();
    let password = user.password.clone();

    let url = "mysql://root:root@localhost:3306/my_database";
    let pool = Pool::new(url).unwrap();
    let mut conn = pool.get_conn().unwrap();
    
    conn.exec_drop(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        (name, email, password),
    ).unwrap();

    println!("User signed up: {:?}", user);
    HttpResponse::Ok().json(user)
}

pub async fn login(user: web::Json<User>) -> impl Responder {
    let email = user.email.clone();
    let password = user.password.clone();
    let url = "mysql://root:root@localhost:3306/my_database";
    let pool = Pool::new(url).unwrap();
    let mut conn = pool.get_conn().unwrap();
    let query = "SELECT id, name, email, password FROM users WHERE email = ? AND password = ?";
    let rows: Vec<Row> = conn.exec(query, (email.clone(), password)).unwrap();

    if rows.is_empty() {
        // User not found
        println!("Error querying user: ");

        return HttpResponse::Unauthorized().json(serde_json::json!({ "message": "Invalid email or password" }));
    }

    // Assuming the first row contains the user data
    let row = &rows[0];
    println!("{:?}",row);
    let user_id: u64 = row.get("id").unwrap();
    let name: Option<String> = row.get("name").unwrap_or(None); 
    println!("Received login request: {:?}", user);

    let token = create_jwt(&email);
    if let Some(name) = name {
        HttpResponse::Ok().json(LoginResponse { token, user_id, name })
    } else {
        HttpResponse::InternalServerError().body("Name not found for the user")
    }
}