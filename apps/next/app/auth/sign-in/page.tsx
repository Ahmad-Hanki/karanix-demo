"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldDescription } from "@/components/ui/field";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { loginInputSchema, LoginInput, useLogin } from "@/servers/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useLogin({
    mutationConfig: {
      onSuccess: () => {
        router.replace("/operations");
      },
      onError: (error) => {
        console.log("Login error:", error);
        toast.error(
          error.response?.data.message || "Failed to login. Please try again."
        );
      },
    },
  });

  const onSubmit = (data: LoginInput) => {
    mutate({
      data,
    });
  };
  return (
    <div className=" min-h-screen flex items-center justify-center">
      <div className={cn("flex flex-col gap-6 ", className)} {...props}>
        <Card>
          <CardContent className="grid  md:grid-cols-2 gap-3">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
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
                        <Input placeholder="Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={isPending} type="submit">
                  {isPending ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>
            <div className="bg-muted relative hidden md:block">
              <img
                src="/file.svg"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
        <FieldDescription className="px-6 text-center">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </FieldDescription>
      </div>
    </div>
  );
}
