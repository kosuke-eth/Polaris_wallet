import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { abi, address } from '@/contracts/mintable-erc721';

export function MintNFT() {
  const { isConnected, address: userAddress } = useAccount();
  const { writeContract, data: hash, isLoading, isSuccess, isError } = useWriteContract();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleMint = async () => {
    if (!userAddress) return;
    try {
      await writeContract({
        abi,
        address,
        functionName: 'safeMint',
        args: [userAddress],
      });
    } catch (error) {
      console.error('Minting failed:', error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => setShowSuccessMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  if (!isConnected) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
        <p className="font-bold">接続エラー</p>
        <p>NFTをミントするにはウォレットを接続してください。</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-2">NFTをミント</h2>
      <p className="text-gray-600 mb-4">あなただけの特別なNFTを作成しましょう</p>
      <p className="mb-4 text-sm text-gray-600">
        接続中のアドレス: {userAddress}
      </p>
      <button 
        onClick={handleMint} 
        disabled={isLoading}
        className={`w-full bg-blue-500 text-white font-bold py-2 px-4 rounded 
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            ミント中...
          </span>
        ) : (
          'NFTをミント'
        )}
      </button>
      {showSuccessMessage && (
        <div className="mt-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
          <p className="font-bold">成功</p>
          <p>NFTのミントが完了しました！</p>
        </div>
      )}
      {isError && (
        <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">エラー</p>
          <p>NFTのミント中にエラーが発生しました。もう一度お試しください。</p>
        </div>
      )}
    </div>
  );
}
