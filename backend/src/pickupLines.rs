use actix_web::{HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use reqwest;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct JsonResponse {
    _id: String,
    text: String,
    category: String,
    language: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PickupLineResponse {
    text: String,
}

pub async fn fetch_pickup_line() -> Result<PickupLineResponse, Box<dyn std::error::Error>> {
    let response = reqwest::get("https://rizzapi.vercel.app/random")
        .await?
        .text()
        .await?;

    let json_response: JsonResponse = serde_json::from_str(&response)?;
    let pickup_line_response = PickupLineResponse {
        text: json_response.text,
    };
    Ok(pickup_line_response)
}

pub async fn get_pickup_line() -> impl Responder {
    match fetch_pickup_line().await {
        Ok(pickup_line_response) => HttpResponse::Ok().json(pickup_line_response),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}
