use anchor_lang::prelude::*;
use crate::state::*;
use crate::error::CustomErrorCode;

/// 关闭用户账户，将租金退还给用户
pub fn close_user_account(ctx: Context<CloseUserAccount>) -> Result<()> {
    let user_account = &ctx.accounts.user_account;
    
    // 可选：添加关闭前的检查条件
    // 例如：确保用户没有未领取的奖励
    let unclaimed_usdt = user_account.total_usdt_earned
        .checked_sub(user_account.total_withdrawn_usdt)
        .unwrap_or(0);
    
    let unclaimed_han = user_account.total_han_earned
        .checked_sub(user_account.total_withdrawn_han)
        .unwrap_or(0);
    
    require!(
        unclaimed_usdt == 0 && unclaimed_han == 0,
        CustomErrorCode::InsufficientWithdrawAmount  // 复用已有错误
    );
    
    msg!(
        "topic_close_user_account: user:{:?}, key_count:{:?}, total_spent:{:?}",
        ctx.accounts.user.key(),
        user_account.key_count,
        user_account.total_usdt_spent
    );
    
    // The close constraint will automatically:
    // 1. Transfer the account's lamports to user
    // 2. Zero out the account data
    // 3. Transfer ownership back to the system program
    
    Ok(())
}

#[derive(Accounts)]
pub struct CloseUserAccount<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    /// 用户账户，使用 close 约束自动关闭并退还租金给 user
    #[account(
        mut,
        seeds = [b"user_account", user.key().as_ref()],
        bump = user_account.bump,
        close = user,  // 关闭账户并将租金退还给 user
    )]
    pub user_account: Account<'info, UserAccount>,

    pub system_program: Program<'info, System>,
}

