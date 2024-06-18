use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};
use reqwest;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct InsultResponse {
    insult: String,
}

pub async fn fetch_insult() -> Result<InsultResponse, Box<dyn std::error::Error>> {
    let response = reqwest::get("https://evilinsult.com/generate_insult.php?lang=en&type=json")
        .await?
        .text()
        .await?;

    let insult_response: InsultResponse = serde_json::from_str(&response)?;
    Ok(insult_response)
}

pub async fn get_insult() -> impl Responder {
    match fetch_insult().await {
        Ok(insult_response) => HttpResponse::Ok().json(insult_response),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}
