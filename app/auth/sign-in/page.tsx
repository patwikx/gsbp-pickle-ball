'use client';

import Link from 'next/link';
import Image from 'next/image';
import { UserAuthForm } from './components/auth-form';
import { Card } from "@/components/ui/card";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      {/* Heading Section */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold uppercase tracking-wide text-indigo-600">
          General Santos Business Park
        </h1>
        <h1 className="text-3xl font-extrabold uppercase tracking-wide text-indigo-600"> Pickle Ball Court</h1>
        <p className="text-sm italic text-gray-600">
          Where community meets recreation
        </p>
      </div>

      {/* Card Section */}
      <Card className="w-[800px] overflow-hidden rounded-3xl shadow-xl">
        <div className="flex flex-col lg:flex-row">
          {/* Left Section with Image */}
          <div className="relative h-[200px] lg:h-auto lg:w-1/2">
            <Image
              src="https://utfs.io/f/pUvyWRtocgCVkHMrpJEt8yXxrNnMQVYoa1gqAFZUHRd9SKG5"
              alt="RD Realty Development Corporation Building"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Right Section with Form */}
          <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
            <div className="w-full max-w-sm space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold tracking-tight">Welcome 👋</h2>
                <p className="text-sm text-muted-foreground">Please login here</p>
              </div>

              <UserAuthForm />

              <div className="text-center text-sm text-muted-foreground">
                <Link href="#" className="hover:text-primary">
                  To report a problem, contact MIS.
                </Link>
              </div>
              <div className="mt-6 text-center text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
