export function abbreviateAddress(address: string) {
  return `${address.substring(0, 5)}...${address.substring(36)}`;
}

export function abbreviateTxnId(txnId: string) {
  return `${txnId.substring(0, 5)}...${txnId.substring(62)}`;
}

export async function getStxBalance(address: string): Promise<number> {
  try {
    const response = await fetch(
      `https://stacks-node-api.testnet.stacks.co/extended/v1/address/${address}/stx`
    );
    const data = await response.json();
    return Math.floor(Number(data.balance) / 1_000_000); // Convert from microSTX to STX
  } catch (error) {
    console.error("Error fetching STX balance:", error);
    return 0;
  }
}