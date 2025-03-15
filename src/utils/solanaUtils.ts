
/**
 * Utility functions for Solana transaction verification
 */

import { useToast } from "@/hooks/use-toast";

// Solscan API endpoints
const SOLSCAN_API_BASE = "https://api.solscan.io";
const SOLSCAN_TX_URL = `${SOLSCAN_API_BASE}/transaction`;

export interface SolscanTransactionResponse {
  success: boolean;
  data?: {
    txHash: string;
    fee: number;
    status: string;
    lamport: number;
    signer: string[];
    parsedInstruction: {
      programId: string;
      type: string;
      amount?: number;
      source?: string;
      destination?: string;
    }[];
  };
}

/**
 * Verifies a Solana transaction via Solscan API
 * @param txId The transaction ID/signature to verify
 * @param expectedAmount The amount in USD expected for this transaction
 * @param expectedRecipient The wallet address that should receive the payment
 * @returns A promise that resolves to a verification result
 */
export const verifySolanaTransaction = async (
  txId: string,
  expectedAmount: number,
  expectedRecipient: string = "HQo1gG52Ae7SUQAHND6ACJ8vFbboYHPpe49dFRP8KZuu"
): Promise<{
  isValid: boolean;
  message: string;
}> => {
  if (!txId || txId.length < 20) {
    return {
      isValid: false,
      message: "Invalid transaction ID format",
    };
  }

  try {
    // Fetch transaction details from Solscan
    const response = await fetch(`${SOLSCAN_TX_URL}/${txId}`);
    
    if (!response.ok) {
      throw new Error(`Solscan API error: ${response.status}`);
    }

    const data: SolscanTransactionResponse = await response.json();

    if (!data.success || !data.data) {
      return {
        isValid: false,
        message: "Transaction not found or invalid",
      };
    }

    // Check if transaction was successful
    if (data.data.status !== "Success") {
      return {
        isValid: false,
        message: "Transaction failed or is still pending",
      };
    }

    // Find the SOL transfer instruction
    const transferInstruction = data.data.parsedInstruction.find(
      (instruction) => instruction.type === "sol-transfer"
    );

    if (!transferInstruction) {
      return {
        isValid: false,
        message: "No SOL transfer found in this transaction",
      };
    }

    // Verify recipient matches expected
    if (
      transferInstruction.destination &&
      transferInstruction.destination.toLowerCase() !== expectedRecipient.toLowerCase()
    ) {
      return {
        isValid: false,
        message: "Payment was sent to the wrong address",
      };
    }

    // Verify amount (converting SOL to USD is challenging, so this is simplified)
    // In a real implementation, you would use a price oracle or exchange rate API
    // This would check if the SOL amount is approximately equal to the expected USD amount
    
    return {
      isValid: true,
      message: "Transaction verified successfully",
    };
  } catch (error) {
    console.error("Error verifying transaction:", error);
    return {
      isValid: false,
      message: "Error verifying transaction. Please try again or contact support.",
    };
  }
};

/**
 * Get Solscan transaction link for a given transaction ID
 */
export const getSolscanTransactionLink = (txId: string): string => {
  return `https://solscan.io/tx/${txId}`;
};
