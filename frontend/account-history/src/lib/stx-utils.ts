// These functions make long blockchain addresses SHORT!
// Like turning "ST3P49R8XXQWG69S66MZASYPTTGNDKK0WW32RRJDN"
// into "ST3P4...RRJDN"

export function abbreviateAddress(address: string) {
    // Take first 5 characters + "..." + last 5 characters
    return `${address.substring(0, 5)}...${address.substring(36)}`;
  }
  
  export function abbreviateTxnId(txnId: string) {
    // Transaction IDs are longer, so we do the same trick
    return `${txnId.substring(0, 5)}...${txnId.substring(62)}`;
  }