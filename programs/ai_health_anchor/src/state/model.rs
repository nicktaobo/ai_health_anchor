use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct GameConfig {
    pub round_number: u64,              // 輪次
    pub state: u8,                      // 狀態: 0: 未开始, 1: 正常, 2: 当轮結束, 3: 全部結束
    pub current_key_price: u64,         // 當前票價 (最小單位: $USDT_DECIMALS)
    pub end_time: i64,                  // 輪次結束時間 (Unix Timestamp)
    pub last_buyer_key: Pubkey,         // 最後一位購票者的 Key
    pub last_buyer_time: i64,           // 最後一位購票者的時間 (Unix Timestamp)
    pub jackpot_pool: u64,              // 當前大獎池
    pub dividend_pool: u64,             // 當前分紅池
    pub next_round_pool: u64,           // 下一輪種子池
    pub leaderboard_pool: u64,          // 排行榜/邀請獎勵池餘額
    pub random_reward_pool: u64,        // 随机奖励池
    pub total_key_count: u64,           // 總購票數量
    pub total_shadow_count: u64,        // 總影子票數量
    pub authority: Pubkey,              // 合約管理者
    pub treasury_usdt_bump: u8,         // USDT 儲備金池 bump
    pub treasury_han_bump: u8,          // HAN 儲備金池 bump
    pub bump: u8,                       // 遊戲配置 bump
}


#[account]
#[derive(InitSpace)]
pub struct UserAccount {
    pub key_count: u64, // 購票數量
    pub total_usdt_spent: u64, // 總花費 USDT
    pub total_usdt_earned: u64, // 總收益 USDT
    pub total_withdrawn_usdt: u64, // 總提現 USDT
    pub total_han_earned: u64, // 總收益 HAN
    pub total_withdrawn_han: u64, // 總提現 HAN
    pub last_key_purchase_time: i64, // 最後一次購票時間 (Unix Timestamp)
    pub bump: u8,
}

