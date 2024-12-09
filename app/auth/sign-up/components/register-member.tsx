"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { MemberRegisterSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { memberRegister } from "@/actions/queries";
import ConfirmationModal from "./modal-confirmation";
import { UploadButton } from "@/utils/uploadthing";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";


type UploadThingFile = {
  url: string;
  name: string;
};

export const MemberRegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [registrationId, setRegistrationId] = useState<string>("");
  const { toast } = useToast();
  const [, setUploadedFileUrls] = useState<string[]>([]);
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([]);

  const form = useForm<z.infer<typeof MemberRegisterSchema>>({
    resolver: zodResolver(MemberRegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      contactNo: "",
      address: "",
      roles: "Member",
      proofPayment: '',
    },
  });

  const onSubmit = (values: z.infer<typeof MemberRegisterSchema>) => {
    setError("");
    startTransition(() => {
      memberRegister(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else if (data.registrationId) {
            setRegistrationId(data.registrationId);
            setShowConfirmation(true);
            form.reset();
            resetFileUpload();
          } else {
            setError("Registration failed. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Registration error:", error);
          setError("An unexpected error occurred. Please try again.");
        });
    });
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    form.reset();
    setUploadedFileNames([]);
    setUploadedFileUrls([]);
  };

  const handleFileUpload = (res: UploadThingFile[]) => {
    if (res && res.length > 0) {
      const fileUrls = res.map((file: UploadThingFile) => file.url);
      const fileNames = res.map((file: UploadThingFile) => file.name);
      setUploadedFileUrls(prevUrls => [...prevUrls, ...fileUrls]);
      setUploadedFileNames(prevNames => [...prevNames, ...fileNames]);
      
      // Set the first uploaded file URL to the imageUrl field
      form.setValue('proofPayment', fileUrls[0]);
      
      toast({
        title: "Upload",
        description: "Upload completed successfully.",
      });
    }
  };

  const resetFileUpload = () => {
    setUploadedFileNames([]);
    setUploadedFileUrls([]);
    form.setValue('proofPayment', '');
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
          <div className="flex flex-col space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="email@example.com"
                      type="email"
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
                  <FormLabel className="font-semibold">Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Contact No</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Enter contact number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Enter address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <div className="mt-2 flex flex-col items-center justify-center">
            <label className="block text-center">
              <div className="flex flex-col items-center mt-4">
                <label className="flex flex-col items-center p-4 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-gray-600 transition duration-300">
                  <span className="text-center font-bold text-md mb-2 text-gray-600">Upload Proof of Payment</span>
                  <UploadButton
                    endpoint="proofPayment"
                    onClientUploadComplete={handleFileUpload}
                    onUploadError={(error: Error) => {
                      toast({
                        title: "Error",
                        description: `Upload failed: ${error.message}`,
                        variant: "destructive",
                      });
                    }}
                  />
                </label>
              </div>
            </label>
            {uploadedFileNames.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                <Label className="font-bold">Uploaded files: </Label>
                <ul className="list-disc pl-5">
                  {uploadedFileNames.map((fileName, index) => (
                    <li key={index}>{fileName}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          </div>
          <Button disabled={isPending} type="submit" className="w-full">
            Create an account
          </Button>
        </form>
        {error && (
          <p className="text-sm font-medium text-destructive mt-2">{error}</p>
        )}
      </Form>
      <ConfirmationModal isOpen={showConfirmation} onClose={handleConfirmationClose} registrationId={registrationId} />
    </>
  );
};

