mod roasts;
mod pickupLines;
mod loginSignup;

mod db;
mod quote;


use std::time::SystemTime;

use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use db::{add_wish, create_database_and_table, get_wishes};

use loginSignup::{login, signup};
use pickupLines::get_pickup_line;
use quote::fetch_quote;
use roasts::get_insult;


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    if let Err(e) = create_database_and_table().await {
        eprintln!("Failed to create database and table: {:?}", e);
        return Err(std::io::Error::new(std::io::ErrorKind::Other, "Database setup failed"));
    }

    HttpServer::new(|| {
        let cors = Cors::permissive(); 

        App::new()
            .wrap(cors) 
            .route("/login", web::post().to(login)) 
            .route("/signup", web::post().to(signup)) 
            .service(
                web::scope("/api")
                    .wrap(HttpAuthentication::bearer(jwt_middleware))
                    .route("/insult", web::get().to(get_insult))
                    .route("/pickupLine", web::get().to(get_pickup_line))
                    .route("/wishes/{user_id}", web::get().to(get_wishes))
                    .route("/wishes/{user_id}", web::post().to(add_wish))
                    .route("/quote", web::get().to(fetch_quote))

            )


    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}




use actix_web_httpauth::{extractors::bearer::BearerAuth, middleware::HttpAuthentication};
use jsonwebtoken::{encode, decode, Header, Validation, EncodingKey, DecodingKey};
use serde::{Deserialize, Serialize};
use std::time::UNIX_EPOCH;

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    exp: usize,
}

const SECRET_KEY: &str = "your-secret-key"; // Replace with your own secret key

fn create_jwt(email: &str) -> String {
    let expiration = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards")
        .as_secs() + 3600; // 1 hour expiration

    let claims = Claims {
        sub: email.to_owned(),
        exp: expiration as usize,
    };

    encode(&Header::default(), &claims, &EncodingKey::from_secret(SECRET_KEY.as_ref())).unwrap()
}

fn verify_jwt(token: &str) -> Result<Claims, jsonwebtoken::errors::Error> {
    decode::<Claims>(token, &DecodingKey::from_secret(SECRET_KEY.as_ref()), &Validation::default())
        .map(|data| data.claims)
}




use actix_web::{dev::ServiceRequest, Error};
use actix_web_httpauth::extractors::AuthenticationError;

async fn jwt_middleware(
    req: ServiceRequest,
    credentials: BearerAuth,
) -> Result<ServiceRequest, Error> {
    let config = actix_web_httpauth::extractors::bearer::Config::default();

    match verify_jwt(credentials.token()) {
        Ok(_claims) => Ok(req),
        Err(_) => Err(Error::from(AuthenticationError::from(config))),
    }
}
