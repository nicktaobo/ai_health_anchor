use anchor_lang::prelude::*;

use crate::{error::CustomErrorCode, state::*, END_STATE};


pub fn stop(ctx: Context<Stop>) -> Result<()> {
    let game_config = &mut ctx.accounts.game_config;
    require_eq!(game_config.authority, ctx.accounts.authority.key(), CustomErrorCode::InvalidAuthority);
    game_config.state = END_STATE;

    // TODO transfer jackpot_pool to last_buyer_key
    
    Ok(())
}

#[derive(Accounts)]
pub struct Stop<'info> {
    
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [b"game_config"],
        bump,
    )]
    pub game_config: Account<'info, GameConfig>,
}