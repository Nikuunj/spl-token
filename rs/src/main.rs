use anyhow::Result;
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_commitment_config::CommitmentConfig;

#[tokio::main]
async fn main() -> Result<()> {
    let client = RpcClient::new_with_commitment(
        String::from("https://api.testnet.solana.com"),
        CommitmentConfig::confirmed(),
    );

    let latest_blockhash = client.get_latest_blockhash().await?;

    print!("{}", latest_blockhash);

    Ok(())
}
