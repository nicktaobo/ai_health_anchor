use anchor_lang::prelude::*;

#[constant]
pub const SEED: &str = "anchor";
pub const ANCHOR_DISCRIMINATOR: usize = 8; 

pub const MAX_TIMER_SECONDS: i64 = 24 * 60 * 60; // 24 小時上限
pub const TIMER_BONUS_SECONDS: i64 = 30;         // 購票增加 30 秒
pub const PRICE_INCREMENT: u64 = 100000;         // 價格遞增 0.1U
pub const INIT_PRICE: u64 = 100000;              // 初始價格 0.1U


pub const NONSTART_STATE: u8 = 0;
pub const RUNNING_STATE: u8 = 1;
pub const END_STATE: u8 = 2;
pub const ALL_END_STATE: u8 = 3;
