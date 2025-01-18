"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import * as z from "zod";
import { useRegisterMutation } from "@/hooks/use-auth";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";

const registerSchema = z.object({
  email: z.string().email().min(5, { message: "Email is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const router = useRouter();

  const {
    mutate: registerCall,
    isPending,
    error: registerError,
  } = useRegisterMutation();

  const onSubmit = (data: RegisterFormData) => {
    if (errors.email || errors.username || errors.password) {
      console.error("Validation errors:", errors);
    } else {
      registerCall(data, {
        onSuccess: (response) => {
          // Handle successful registration
          console.log("Registration successful:", response);
          router.push("/login");
        },
        onError: (error) => {
          // Handle login error
          console.error("Login error:", error);
        },
      });
    }
  };

  useEffect(() => {
    if (registerError) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: registerError?.message || "An unknown error occurred.",
      });
    }
  }, [registerError]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 shadow-md rounded p-8  mb-4"
      >
        <div className="flex items-center mb-4">
          <Image
            src={process.env.LOGO_PATH || "/logo-min.png"}
            alt="Logo"
            className="h-10 w-10 mr-2"
            height={40}
            width={40}
          />
          <h1 className="text-2xl font-bold">PM 4</h1>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="john.doe@example.com"
          />
          {errors.email?.message && (
            <p className="text-red-500 text-xs italic">
              {errors.email.message as string}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            {...register("username")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your username"
          />
          {errors.username?.message && (
            <p className="text-red-500 text-xs italic">
              {errors.username.message as string}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register("password")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your password"
          />
          {errors.password?.message && (
            <p className="text-red-500 text-xs italic">
              {errors.password.message as string}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={isPending || isSubmitting}
          >
            {isPending || isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
        <div className="mt-4">
          <span className="text-gray-500 text-sm">
            Already have an account?{" "}
          </span>
          <Link href="/login" className="text-blue-500 hover:underline text-sm">
            Log in!
          </Link>
        </div>
      </form>
    </div>
  );
}
