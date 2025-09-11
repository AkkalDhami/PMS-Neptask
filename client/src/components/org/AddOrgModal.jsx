import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlus, X, Loader, Edit, Edit2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orgSchema } from "../../schemas/org";
import toast from "react-hot-toast";

const AddOrgModal = ({
  initialData = null,
  onsubmit,
  isDialogOpen = false,
  setIsDialogOpen = () => {},
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      name: initialData?.name || "",
      orgEmail: initialData?.orgEmail || "",
      logo: null,
      members: [],
    },
    mode: "onTouched",
  });

  const [apiError, setApiError] = useState(null);
  const [logoPreview, setLogoPreview] = useState(initialData?.logo?.url || "");
  const [logo, setLogo] = useState(null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (formData) => {
    setApiError(null);
    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("orgEmail", formData.orgEmail);
      if (logo) {
        fd.append("logo", logo);
      }

      await onsubmit(fd);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Something went wrong.");
      setApiError(err?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button type="button">
          {initialData ? (
            <>
              <Edit2 /> Update Organization
            </>
          ) : (
            <>
              <CirclePlus /> Add Organization
            </>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Update Organization" : "Create Organization"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update your organization details"
              : "Create a new organization to manage your projects"}
          </DialogDescription>
        </DialogHeader>

        {/* Put the form inside DialogContent */}
        <form onSubmit={handleSubmit(submitHandler)} className="grid gap-4">
          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">Organization Name *</Label>
            <Input id="name" placeholder="Enter name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="orgEmail">Organization Email *</Label>
            <Input
              id="orgEmail"
              placeholder="example@email.com"
              {...register("orgEmail")}
            />
            {errors.orgEmail && (
              <p className="text-sm text-red-500">{errors.orgEmail.message}</p>
            )}
          </div>

          {/* Logo */}
          <div className="grid gap-2">
            <Label htmlFor="logo">Organization Logo</Label>
            <Input
              type="file"
              accept="image/*"
              id="logo"
              {...register("logo")}
              onChange={handleLogoChange}
            />
            {logoPreview && (
              <img
                src={logoPreview}
                alt="Logo Preview"
                className="w-20 h-20 mt-2 rounded-md object-cover border"
              />
            )}
          </div>

          {apiError && (
            <p className="text-red-500 bg-red-500/10 px-2 py-1 border-l-4 border-red-500">
              {apiError}
            </p>
          )}

          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader className="mr-2 h-5 w-5 animate-spin" />
                  {initialData ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{initialData ? "Update" : "Create"}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrgModal;
