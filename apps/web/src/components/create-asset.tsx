"use client";

import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Upload, X, LoaderCircle, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { createClient } from "../utils/supabase/client";
import toast from "react-hot-toast";
import { trpc } from "../utils/trpc/trpc";
import { UserResponse } from "@supabase/supabase-js";

type CreateAssetFormInputs = {
  name: string;
  description?: string;
  image: FileList;
};

export default function CreateAssetDialog({
  user,
}: {
  user: UserResponse["data"]["user"];
}) {
  const [previewUrl, setPreviewUrl] = useState("");
  const { register, handleSubmit } = useForm<CreateAssetFormInputs>(); // initialize react-hook-form
  let [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createClient();
  const utils = trpc.useUtils();

  const createAssetMutation = trpc.asset.create.useMutation({
    onSuccess() {
      utils.asset.getAll.invalidate();
    },
  });

  // set the preview image when the user selects an image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // upload the image to supabase storage
  const uploadImage = async (file: File) => {
    const assetName = `nft-${Date.now()}`;

    const { data, error } = await supabase.storage
      .from("nfts")
      .upload(assetName, file);

    if (!error) {
      // get the public URL of the uploaded image
      const { data } = supabase.storage.from("nfts").getPublicUrl(assetName);
      return data.publicUrl;
    }
  };

  const onSubmit = async (data: CreateAssetFormInputs) => {
    const toastId = toast.loading("Uploading image..."); // store the toast ID to update the toast later
    try {
      setIsSubmitting(true);
      const imageUrl = await uploadImage(data.image[0]);

      if (!imageUrl) {
        throw new Error("Couldn't upload image");
      }

      toast.loading("Creating asset...", { id: toastId });

      await createAssetMutation.mutateAsync({
        ownerId: user!.id,
        name: data.name,
        description: data.description,
        assetUrl: imageUrl,
        ownerEmail: user!.email as string,
      });

      toast.success("Asset created successfully", { id: toastId });

      setIsSubmitting(false);
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);

      toast.error("Couldn't create asset, please try again.", {
        id: toastId,
      });
    }
  };

  const clearImage = () => {
    setPreviewUrl("");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-primary w-full lg:w-max rounded-lg p-5 py-2 text-primary-foreground text-base hover:bg-primary/90 focus:ring-1 ring-ring ring-offset-1 group flex justify-center items-center gap-2"
      >
        Add asset
        <Plus
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
          <DialogPanel className="lg:w-[45%] md:w-2/3 w-full space-y-4 bg-card rounded-lg border border-border p-6">
            <div className="flex flex-col gap-2">
              <DialogTitle className="font-bold flex justify-between items-center text-lg leading-none">
                Add new NFT asset
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-foreground rounded-lg hover:bg-accent"
                >
                  <X size={20} />
                </button>
              </DialogTitle>
              <Description className="mt-0 p-0 m-0 text-muted-foreground leading-none text-sm">
                Fill in the details below to add a new NFT asset to your
                collection.
              </Description>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="name">Asset name *</label>
                <input
                  type="text"
                  {...register("name", { required: true })}
                  placeholder="My new asset"
                  required
                  className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors  placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="description">Asset description</label>
                <textarea
                  {...register("description", { required: false })}
                  placeholder="A short description of your asset"
                  className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors  placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="image">Asset image *</label>
                <div className="relative">
                  {previewUrl ? (
                    <div className="relative w-full h-64 rounded-lg overflow-hidden">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-2 right-2 p-1 bg-red-400 text-white rounded-lg hover:bg-red-400/90"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-64 border border-dashed shadow-sm border-input rounded-lg cursor-pointer hover:bg-accent focus-visible:ring-1 focus-visible:ring-ring">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 text-zinc-400" />
                        <p className="mt-2 text-sm text-zinc-500">
                          Click or drag image to upload
                        </p>
                      </div>
                      <input
                        {...register("image", {
                          required: true,
                          onChange: handleImageChange,
                        })}
                        type="file"
                        required
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary w-max rounded-lg p-5 py-2 text-primary-foreground text-base hover:bg-primary/90 focus:ring-1 ring-ring ring-offset-1 group flex justify-center items-center gap-2"
              >
                {isSubmitting && (
                  <LoaderCircle size={16} className="animate-spin" />
                )}
                Add NFT
              </button>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
