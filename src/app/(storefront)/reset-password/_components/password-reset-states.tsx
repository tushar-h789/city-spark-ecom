import React from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PasswordResetState } from "@/types/misc";

interface PasswordResetStatesProps {
  state: PasswordResetState;
  onRequestNewLink: () => void;
}

export default function PasswordResetStates({
  state,
  onRequestNewLink,
}: PasswordResetStatesProps): React.ReactElement | null {
  if (state === "verifying") {
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

  if (state === "invalid") {
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
          <Button onClick={onRequestNewLink}>Request New Reset Link</Button>
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

  return null;
}
