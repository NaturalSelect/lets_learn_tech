// 验证码是发到邮箱里的，根据随机函数随机生成一个六位整数
// 然后将这样一个pair加入到一个哈希表中
// 最后就是定时功能，超过一定时间这个验证码就失效。

use axum::{Json, http};
use axum::response::IntoResponse;
use axum::http::StatusCode;
use serde::{Deserialize, Serialize};
use crate::services::token;
use crate::services::verifycode::G_VERIFY_MANAGER;
use crate::services::email_service::{G_EMAIL_MANAGER, EmailSendResult};
use crate::models::user::UserId;
use axum::body::{HttpBody, Body};
use axum::extract::ConnectInfo;
use std::net::SocketAddr;
use std::future::Future;
use crate::models::tag::TagId;
use crate::db::sql::get_dbhandler;
use crate::models::article::{Article, ArticlePreview, ArticleId};
// use std::alloc::Global;
use crate::services;

pub async fn article_getdetail(
    ConnectInfo(_addr): ConnectInfo<SocketAddr>,
    req: Json<RequestContent>,
) -> impl IntoResponse {
    return match services::article::G_ARTICLE_MAN
        .get_article_by_id(req.id).await {
        None => {
            (StatusCode::BAD_REQUEST, "notfound").into_response()
        }
        Some(ar) => {
            (StatusCode::OK, serde_json::to_string(&ResponseContent {
                article: ar
            }).unwrap()).into_response()
        }
    }
}

// the input to our `create_user` handler
#[derive(Deserialize, Serialize)]
pub struct RequestContent {
    pub id:ArticleId
}

#[derive(Deserialize, Serialize)]
pub struct ResponseContent{
    pub article:Article
}