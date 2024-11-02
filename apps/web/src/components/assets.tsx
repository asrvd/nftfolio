"use client";

import { trpc } from "../utils/trpc/trpc";
import type { UserResponse } from "@supabase/supabase-js";
import Link from "next/link";

export default function AssetGallery({
  user,
}: {
  user: UserResponse["data"]["user"];
}) {
  const { data, isLoading } = trpc.asset.getAll.useQuery({
    userId: user!.id,
  });

  return (
    <div className="w-full grid grid-cols-1 gap-4 lg:grid-cols-3">
      {isLoading && (
        <>
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
        </>
      )}
      {data &&
        data.length > 0 &&
        data.map((asset) => (
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
                <span className="text-sm text-muted-foreground">
                  #{asset.id}
                </span>
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
}
