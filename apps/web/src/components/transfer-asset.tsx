"use client";

import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { X, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { trpc } from "../utils/trpc/trpc";
import { UserResponse } from "@supabase/supabase-js";

type TransferAssetFormInputs = {
  email: string;
};

export default function TransferAssetDialog({
  assetId,
  user,
}: {
  assetId: string;
  user: UserResponse["data"]["user"];
}) {
  const { register, handleSubmit } = useForm<TransferAssetFormInputs>();
  let [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const utils = trpc.useUtils();

  const transferAssetMutation = trpc.asset.transfer.useMutation({
    onSuccess() {
      utils.asset.get.invalidate();
    },
  });

  const onSubmit = async (data: TransferAssetFormInputs) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Transferring asset");

    try {
      await transferAssetMutation.mutateAsync({
        fromUserId: user!.id,
        toUserEmail: data.email,
        assetId: assetId,
      });

      toast.success("Asset transferred successfully", {
        id: toastId,
      });
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to transfer asset", {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-primary h-max w-full lg:w-max rounded-lg p-5 py-2 text-primary-foreground text-base hover:bg-primary/90 focus:ring-1 ring-ring ring-offset-1 group flex justify-center items-center gap-2"
      >
        Transfer asset
        <ArrowRight
          size={16}
          className="transform group-hover:translate-x-1 transition-transform"
        />
      </button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-6 bg-muted-foreground/90">
          <DialogPanel className="lg:w-[40%] md:w-2/3 w-full space-y-4 bg-card rounded-lg border border-border p-6">
            <div className="flex flex-col gap-2">
              <DialogTitle className="font-bold flex justify-between items-center text-lg leading-none">
                Transfer NFT
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-foreground rounded-lg hover:bg-accent"
                >
                  <X size={20} />
                </button>
              </DialogTitle>
              <Description className="mt-0 p-0 m-0 text-muted-foreground leading-none text-sm">
                Transfer this NFT to another user by entering their email
                address
              </Description>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="email">Recipient email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="johndoe@gmail.com"
                  {...register("email", { required: true })}
                  className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors  placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary w-max rounded-lg p-5 py-2 text-primary-foreground text-base hover:bg-primary/90 focus:ring-1 ring-ring ring-offset-1 group flex justify-center items-center gap-2"
              >
                {isSubmitting && (
                  <LoaderCircle size={16} className="animate-spin" />
                )}
                Transfer
              </button>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
