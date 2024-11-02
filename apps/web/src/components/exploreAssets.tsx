"use client";

import { trpc } from "../utils/trpc/trpc";
import type { UserResponse } from "@supabase/supabase-js";
import Link from "next/link";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useDebounce } from "@uidotdev/usehooks";

export default function Explore({
  user,
}: {
  user: UserResponse["data"]["user"];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  const { data, isLoading } = trpc.asset.list.useQuery({
    searchQuery: debouncedSearchQuery,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex lg:flex-row flex-col gap-2 justify-between items-center">
        <h2 className="font-extrabold text-3xl leading-none">Explore NFTs</h2>
        <input
          type="text"
          onChange={handleInputChange}
          value={searchQuery}
          placeholder="Search by NFT name, owner, or ID"
          className="flex lg:w-[60%] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors  placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-5"
        />
      </div>
      {isLoading && (
        <div className="w-full grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-2 p-4 bg-card border border-border rounded-lg shadow-sm animate-pulse">
            <div className="aspect-square rounded-lg border border-border bg-accent" />
            <div className="flex flex-col gap-2">
              <div className="h-4 bg-accent rounded-lg" />
              <div className="h-4 bg-accent rounded-lg" />
            </div>
          </div>
          <div className="flex flex-col gap-2 p-4 bg-card border border-border rounded-lg shadow-sm animate-pulse">
            <div className="aspect-square rounded-lg border border-border bg-accent" />
            <div className="flex flex-col gap-2">
              <div className="h-4 bg-accent rounded-lg" />
              <div className="h-4 bg-accent rounded-lg" />
            </div>
          </div>
          <div className="flex flex-col gap-2 p-4 bg-card border border-border rounded-lg shadow-sm animate-pulse">
            <div className="aspect-square rounded-lg border border-border bg-accent" />
            <div className="flex flex-col gap-2">
              <div className="h-4 bg-accent rounded-lg" />
              <div className="h-4 bg-accent rounded-lg" />
            </div>
          </div>
        </div>
      )}
      {data && data.length > 0 && (
        <div className="w-full grid grid-cols-1 gap-4 lg:grid-cols-3">
          {data.map((asset) => (
            <Link href={`/asset/${asset.id}`} key={asset.id}>
              <div
                key={asset.id}
                className="flex flex-col gap-2 p-4 bg-card border border-border rounded-lg shadow-sm hover:bg-accent cursor-pointer"
              >
                <img
                  className="aspect-square rounded-lg border border-border object-cover bg-card"
                  src={asset.assetUrl}
                  alt="NFT"
                />
                <div className="flex flex-col">
                  <h3 className="font-bold text-xl">{asset.name}</h3>
                  <span
                    className="text-sm text-muted-foreground
                                "
                  >
                    #{asset.id}
                  </span>
                  <span
                    className="text-sm text-muted-foreground
                                "
                  >
                    <span className="font-bold text-foreground">Owner</span>:{" "}
                    {asset.owner.email}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
