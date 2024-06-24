use serde::{Serialize, Deserialize};
use actix_web::{get, HttpResponse};
use reqwest::Client;
use serde_json::Value;

#[derive(Serialize, Deserialize)]
struct QuoteResponse {
    quote: String,
    author: String,
}

pub async fn fetch_quote() -> HttpResponse {
    let client = Client::new();
    let response = client
        .get("https://api.quotable.io/quotes/random")
        .send()
        .await;

    match response {
        Ok(resp) => {
            if resp.status().is_success() {
                let quote_json: Value = resp.json().await.unwrap();
                let quote = quote_json[0]["content"].as_str().unwrap_or("No quote found").to_string();
                let author = quote_json[0]["author"].as_str().unwrap_or("Unknown author").to_string();

                let quote_response = QuoteResponse { quote, author };
                HttpResponse::Ok().json(quote_response)
            } else {
                HttpResponse::InternalServerError().body("Failed to fetch quote")
            }
        }
        Err(_) => HttpResponse::InternalServerError().body("Failed to fetch quote"),
    }
}