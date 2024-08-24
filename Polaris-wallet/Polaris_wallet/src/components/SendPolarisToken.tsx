import React, { useState, useEffect } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { erc20Abi, parseEther, formatEther } from "viem";
import { AlertCircle, CheckCircle, Send } from "lucide-react";

export const SendPolarisToken = () => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionStatus, setTransactionStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const { address } = useAccount();

  const tokenAddress = "0xAaf6A734114437b719c28cfd44c0b2B515eD29be";

  const { 
    writeContract, 
    data: hash, 
    isError, 
    isSuccess, 
    isLoading 
  } = useWriteContract();

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address!],
  });

  useEffect(() => {
    if (isSuccess) {
      setTransactionStatus("success");
      refetchBalance();
    } else if (isError) {
      setTransactionStatus("error");
    } else if (isLoading) {
      setTransactionStatus("pending");
    } else {
      setTransactionStatus("idle");
    }
  }, [isSuccess, isError, isLoading, refetchBalance]);

  const handleSend = async () => {
    if (!recipient || !amount) return;
    
    try {
      await writeContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "transfer",
        args: [recipient as `0x${string}`, parseEther(amount)],
      });
    } catch (error) {
      console.error("送金エラー:", error);
      setTransactionStatus("error");
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-orange-800 mb-4">Polarisトークン送金</h2>
      <div className="bg-white p-4 rounded-lg shadow-inner mb-4">
        <p className="text-sm text-gray-600">あなたのアドレス</p>
        <p className="font-mono text-orange-700">{address ? formatAddress(address) : "未接続"}</p>
        <p className="text-sm text-gray-600 mt-2">残高</p>
        <p className="text-xl font-bold text-orange-600">
          {balance ? parseFloat(formatEther(balance)).toFixed(4) : "0"} POLARIS
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">受取人アドレス</label>
          <input
            id="recipient"
            type="text"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">送金額</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              id="amount"
              type="number"
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">POLARIS</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleSend}
          disabled={isLoading}
          className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
            isLoading && "opacity-50 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              処理中...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              送金
            </>
          )}
        </button>
      </div>
      {transactionStatus === "success" && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded relative" role="alert">
          <CheckCircle className="inline-block mr-2" />
          送金が完了しました！
        </div>
      )}
      {transactionStatus === "error" && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded relative" role="alert">
          <AlertCircle className="inline-block mr-2" />
          送金に失敗しました。もう一度お試しください。
        </div>
      )}
    </div>
  );
};
