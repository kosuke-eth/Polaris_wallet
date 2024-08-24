import React, { useState } from 'react';
import { useAccount, useReadContract } from "wagmi";
import Image from "next/image";
import { abi, address } from "@/contracts/mintable-erc721";
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const NFTCard = ({ nft }) => (
  <div className="bg-white border rounded-lg p-4 shadow-md transition-all duration-300 hover:shadow-lg">
    <div className="relative w-full h-40 mb-3">
      <Image
        src={nft.image}
        alt={nft.name}
        layout="fill"
        objectFit="cover"
        className="rounded-md"
      />
    </div>
    <h3 className="font-semibold text-base text-indigo-700 truncate">{nft.name}</h3>
    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{nft.description}</p>
  </div>
);

export function OwnedNfts() {
  const { address: userAddress } = useAccount();
  const [currentPage, setCurrentPage] = useState(1);
  const nftsPerPage = 6;

  const { data: balanceData, isLoading: balanceLoading, isError: balanceError } = useReadContract({
    abi,
    address,
    functionName: "balanceOf",
    args: [userAddress],
  });

  const mockNFTs = Array.from({ length: balanceData ? Number(balanceData) : 0 }, (_, i) => ({
    id: i + 1,
    name: `Polaris NFT #${i + 1}`,
    description: "A unique Polaris NFT with special properties and attributes.",
    image: "https://ipfs.io/ipfs/QmVnxgB2HGe4EV4QWagMJK3J8ReavfHxfjDSy5v7gNuGGN",
  }));

  const indexOfLastNFT = currentPage * nftsPerPage;
  const indexOfFirstNFT = indexOfLastNFT - nftsPerPage;
  const currentNFTs = mockNFTs.slice(indexOfFirstNFT, indexOfLastNFT);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (balanceLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (balanceError) {
    return (
      <div className="text-center text-red-500 p-4 bg-red-100 rounded-lg text-sm">
        エラーが発生しました。再度お試しください。
      </div>
    );
  }

  if (!balanceData || Number(balanceData) === 0) {
    return (
      <div className="text-center text-gray-500 p-4 bg-gray-100 rounded-lg text-sm">
        NFTを保有していません。新しいNFTをミントしてみましょう！
      </div>
    );
  }

  return (
    <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-lg shadow-inner">
      <h2 className="text-2xl font-bold mb-4 text-indigo-800">所有NFT</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {currentNFTs.map((nft) => (
          <NFTCard key={nft.id} nft={nft} />
        ))}
      </div>
      {mockNFTs.length > nftsPerPage && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 bg-indigo-500 text-white rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm text-gray-600">
            {currentPage} / {Math.ceil(mockNFTs.length / nftsPerPage)}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(mockNFTs.length / nftsPerPage)}
            className="p-2 bg-indigo-500 text-white rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
