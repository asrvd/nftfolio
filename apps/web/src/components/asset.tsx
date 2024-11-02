"use client";

import { trpc } from "../utils/trpc/trpc";
import type { UserResponse } from "@supabase/supabase-js";
import TransferAssetDialog from "./transfer-asset";
import EditAssetDialog from "./update-asset";
import type { Asset } from "@repo/api/src/lib/db/schema";

export default function Asset({
  user,
  assetId,
}: {
  user: UserResponse["data"]["user"] | null;
  assetId: string;
}) {
  const { data, isLoading } = trpc.asset.get.useQuery({
    id: assetId,
  });

  return (
    <>
      {isLoading && (
        <div className="flex flex-col gap-4 p-4 lg:w-1/2 md:w-2/3 w-full">
          <div className="flex lg:flex-row flex-col gap-2 justify-between">
            <div className="w-56 h-56 bg-accent rounded-lg animate-pulse" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="h-8 bg-accent rounded-lg" />
            <div className="h-8 bg-accent rounded-lg" />
            <div className="h-8 bg-accent rounded-lg" />
          </div>
        </div>
      )}
      {data && (
        <div className="flex flex-col gap-2 p-4 lg:w-1/2 md:w-2/3 w-full">
          <div className="flex lg:flex-row flex-col gap-2 justify-between">
            <img
              className="rounded-lg border border-border object-cover bg-card lg:w-56 lg:h-56 w-full aspect-square"
              src={data?.assetUrl}
              alt="NFT"
            />
            {data?.owner.id === user?.id ? (
              <div className="flex lg:flex-row flex-col gap-2">
                <TransferAssetDialog assetId={assetId} user={user} />
                <EditAssetDialog asset={data} user={user} />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">Owner</span>:{" "}
                {data?.owner.email}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-xl">{data?.name}</h3>
            <span className="text-sm text-muted-foreground">#{data?.id}</span>
            <span className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">Created at</span>:{" "}
              {new Date(data?.createdAt!).toLocaleString()}
            </span>

            {data?.description && (
              <p className="text-sm text-foreground">{data?.description}</p>
            )}
          </div>
          <div className="h-px w-full bg-border" />
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Transaction history</h3>
            {data.transactions.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No transactions yet, any new transactions will appear here.
              </p>
            )}
            <div className="flex flex-col gap-2">
              {data?.transactions.map((transaction) => (
                <div key={transaction.id}>
                  <div key={transaction.id} className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-bold text-foreground">From</span>:{" "}
                      {transaction.fromUserEmail}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-bold text-foreground">To</span>:{" "}
                      {transaction.toUserEmail}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-bold text-foreground">
                        Transaction date
                      </span>
                      : {new Date(transaction.createdAt!).toLocaleString()}
                    </p>
                  </div>
                  {data?.transactions.indexOf(transaction) !==
                    data.transactions.length - 1 && (
                    <div className="h-px w-full bg-border mt-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
