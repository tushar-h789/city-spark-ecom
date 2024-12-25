"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { resetPassword, verifyResetToken } from "../actions";
import { ResetPasswordFormData, resetPasswordSchema } from "../schema";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { PasswordResetState } from "@/types/misc";

export default function ResetPasswordForm({ token }: { token?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState<PasswordResetState>("verifying");
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setFormState("invalid");
        return;
      }

      try {
        const result = await verifyResetToken(token);
        setFormState(result.success ? "valid" : "invalid");
      } catch (error) {
        console.error("Token verification error:", error);
        setFormState("invalid");
      }
    }

    verifyToken();
  }, [token]);

  async function onSubmit(values: ResetPasswordFormData) {
    if (formState !== "valid") {
      toast({
        title: "Error",
        description: "Invalid or expired reset token",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await resetPassword(token!, values.password);
      if (result.success) {
        toast({
          title: "Password reset successful",
          description: "You can now log in with your new password.",
          variant: "success",
        });
        router.push("/login");
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (formState === "verifying") {
    return (
      <div className="container max-w-md mx-auto py-20 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Verifying Reset Token</h1>
        <p className="text-muted-foreground">
          Please wait while we verify your reset token...
        </p>
      </div>
    );
  }

  if (formState === "invalid") {
    return (
      <div className="container max-w-md mx-auto py-20">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Invalid Reset Link</AlertTitle>
          <AlertDescription>
            The password reset link is invalid or has expired.
          </AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
          <Button onClick={() => router.push("/forgot-password")}>
            Request New Reset Link
          </Button>
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto py-20">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
