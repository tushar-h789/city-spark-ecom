"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LoadingButton } from "@/components/ui/loading-button";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import GoogleIcon from "@/components/icons/google";
import FacebookIcon from "@/components/icons/facebook";
import AppleIcon from "@/components/icons/apple";
import { SVGProps } from "react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const formFields = [
  {
    name: "email" as const,
    icon: Mail,
    placeholder: "Email address",
    type: "text",
  },
  {
    name: "password" as const,
    icon: LockKeyhole,
    placeholder: "Password",
    type: "password",
  },
] as const;

const socialProviders = [
  { provider: "google" as const, icon: GoogleIcon },
  { provider: "facebook" as const, icon: FacebookIcon },
  { provider: "apple" as const, icon: AppleIcon },
];

interface CheckoutAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SocialLoginButton = ({
  provider,
  icon: Icon,
  isLoading,
  callbackUrl,
}: {
  provider: "google" | "facebook" | "apple";
  icon: React.FC<SVGProps<SVGSVGElement>>;
  isLoading: boolean;
  callbackUrl: string;
}) => (
  <Button
    variant="outline"
    onClick={() => signIn(provider, { callbackUrl })}
    disabled={isLoading}
    className="relative h-11 rounded-lg border-gray-300 hover:bg-gray-50"
  >
    <div className="mr-2">
      <Icon width={20} height={20} />
    </div>
    <span>
      Continue with {provider.charAt(0).toUpperCase() + provider.slice(1)}
    </span>
  </Button>
);

export function CheckoutAuthDialog({
  open,
  onOpenChange,
}: CheckoutAuthDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const callbackUrl = `${window.location.origin}/checkout`;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onGuestCheckout = () => {
    router.push("/checkout");
    onOpenChange(false);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        form.setError("root", { message: "Invalid email or password" });
        return;
      }

      router.push(callbackUrl);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 bg-white overflow-hidden sm:max-w-[400px] gap-0 rounded-xl border-gray-300">
        <div className="bg-primary/5">
          <DialogHeader className="p-6 text-left">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Checkout Options
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-2">
              Choose how you&apos;d like to continue with your purchase
            </p>
            <Button
              className="w-full mt-6 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm h-11 rounded-lg"
              onClick={onGuestCheckout}
              disabled={isLoading}
            >
              Continue as Guest
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogHeader>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <h3 className="text-base font-semibold mb-6 text-gray-900">
              Sign in to your account
            </h3>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {formFields.map((field) => (
                  <FormField
                    key={field.name}
                    control={form.control}
                    name={field.name}
                    render={({ field: fieldProps }) => (
                      <FormItem className="space-y-2">
                        <FormControl>
                          <div className="relative">
                            <field.icon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                              type={field.type}
                              placeholder={field.placeholder}
                              className="pl-10 h-11 rounded-lg border-gray-300"
                              {...fieldProps}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                {form.formState.errors.root && (
                  <div className="text-sm text-red-500">
                    {form.formState.errors.root.message}
                  </div>
                )}
                <LoadingButton
                  type="submit"
                  className="w-full h-11 rounded-lg bg-primary hover:bg-primary/90"
                  loading={isLoading}
                >
                  Sign in to continue
                </LoadingButton>
              </form>
            </Form>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-gray-500 text-[11px]">
                  Quick sign in with
                </span>
              </div>
            </div>

            <div className="grid gap-3">
              {socialProviders.map(({ provider, icon }) => (
                <SocialLoginButton
                  key={provider}
                  provider={provider}
                  icon={icon}
                  isLoading={isLoading}
                  callbackUrl={callbackUrl}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
