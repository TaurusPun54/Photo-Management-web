"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { userInterface } from "@/lib/types/userInterface";
import { updateUser } from "./action";
import { getUser } from "../action";
import { toast } from "sonner";

interface ProfileProps {
  token: string;
  user: userInterface;
}

export default function ProfilePage({ token, user }: ProfileProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(token),
    initialData: user,
    staleTime: 5 * 60 * 1000,
  });

  const [formData, setFormData] = useState<userInterface>(userData);
  const [isChanged, setIsChanged] = useState(false);
  const mutation = useMutation({
    mutationFn: (data: FormData) => updateUser(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Profile updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });

  useEffect(() => {
    const hasChanges =
      formData.first_name !== userData.first_name ||
      formData.last_name !== userData.last_name ||
      formData.avatar !== userData.avatar;
    setIsChanged(hasChanges);
  }, [formData, userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });
    mutation.mutate(data);
  };

//   const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const formData = new FormData();
//       formData.append("avatar", file);
//       mutation.mutate(formData);
//     }
//   };

  return (
    <div className="container max-w-2xl py-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="mr-4"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">Edit Profile</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your personal information and how others see you on the platform.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmitUpdate}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name || ""}
                onChange={handleInputChange}
                placeholder="Your first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name || ""}
                onChange={handleInputChange}
                placeholder="Your last name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={formData.email || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-sm text-muted-foreground">
                Email cannot be changed. Contact support for assistance.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isChanged || mutation.isPending}
            >
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}