"use client";

// import axios from "axios";
import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  //   FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

import axios from "axios";
import { baseUrl } from "@/lib/utils";
// import { cookies } from "next/headers";

const loginFormSchema = z.object({
  username: z.string().min(1, "email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize the form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Handle form submission
  const login = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new URLSearchParams();
      formData.append("username", data.username);
      formData.append("password", data.password);
      const response = await axios.post(`${baseUrl}/user/login`, formData, {
        withCredentials: true,
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
          //   "Content-Type": "application/json",
        },
      });

      // Log the full response to inspect headers
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);
      console.log("Response headers:", response.headers);

      // Check for Set-Cookie header explicitly
      const setCookie = response.headers["set-cookie"];
      console.log("Set-Cookie:", setCookie || "No cookies found");

      // Check if the response is successful and contains the expected data
      if (response.status === 200 && response.data.code === 200) {
        // Redirect to home page after successful login
        router.push("/home");
      } else {
        setError("Unexpected response format from server.");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (axios.isAxiosError(err) && err.response) {
        // const status = err.response.status;
        const message = err.response.data.detail || "An error occurred";
        setError(message)
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          Sign in to your account
        </CardTitle>
        <CardDescription>
          Enter your username or email and password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(login)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-muted-foreground">
          <Link
            href="/auth/forgot-password"
            className="underline underline-offset-4 hover:text-primary"
          >
            Forgot your password?
          </Link>
        </div>
        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
