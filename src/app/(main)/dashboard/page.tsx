/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import { Copy, Edit, PlusCircle, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";

type FormField = {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: Array<string> | null[];
  file?: File | null;
  previewUrl?: string | null;
  price?: number;
};

export interface Form {
  id: number;
  title: string;
  description: string;
  fields: FormField[];
  urlId: string;
  createdAt: string;
  submissionCount: number;
}

export function SidebarDemo() {
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchForms = async () => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast({
          title: "Error",
          description: "No session found.",
          variant: "destructive",
        });
        router.push("/auth/login");
      }

      const res = await fetch("/api/forms/list", {
        headers: {
          Authorization: `Bearer ${session!.access_token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setForms(data);
      } else {
        throw new Error(data.error || "Failed to fetch forms.");
      }
    } catch (error) {
      console.error("Error fetching forms:", error);
      toast({
        title: "Error",
        description: "Failed to load forms.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of forms
  useEffect(() => {
    fetchForms();
  }, []);

  const deleteForm = async (id: number) => {
    try {
      const res = await fetch(`/api/forms/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("API Error Response:", errorData);
        throw new Error(errorData.message || "Failed to delete the form.");
      }

      setForms((prevForms) => prevForms.filter((form) => form.id !== id));

      toast({
        title: "Form deleted",
        description: "The form was successfully deleted.",
        variant: "default",
      });

      await fetchForms(); // Refetch forms to ensure state consistency
    } catch (error) {
      console.error("Error deleting form:", error);
      toast({
        title: "Error",
        description: `Failed to delete the form. ${error}`,
        variant: "destructive",
      });
    }
  };

  const duplicateForm = async (form: Form) => {
    console.log("before duplication request", form);

    const { title, description, ...fields } = form;

    try {
      const formData = {
        title: `${form.title} (Copy)`,
        description: form.description,
        fields: fields,
      };
      const res = await fetch("/api/forms/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error duplicating form:", errorData.error);
        throw new Error(errorData.error || "Failed to duplicate the form.");
      }

      const data = await res.json();
      console.log("Duplicate Form Response:", data);

      toast({
        title: "Form duplicated",
        description: "The form was successfully duplicated.",
        variant: "default",
      });

      // Only refetch forms if duplication was successful
      await fetchForms();
    } catch (error) {
      console.error("Error duplicating form:", error);
      toast({
        title: "Error",
        description: "Failed to duplicate the form.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-1">
      <div className="p-4 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-4 flex-1 w-full h-full">
        <div className="flex justify-between items-center w-full p-4">
          <h2 className="text-xl font-bold">Your Forms</h2>
          <Button onClick={() => router.push("/forms/create")}>
            <PlusCircle className="h-4 w-4" />
            Create Form
          </Button>
        </div>
        {loading ? (
          <p>Loading forms...</p>
        ) : forms.length === 0 ? (
          <p>No forms found.</p>
        ) : (
          <ul className="space-y-4">
            {forms.map((form) => (
              <li
                key={form.id}
                className="p-4 border rounded-md bg-gray-50 dark:bg-neutral-800 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-bold">{form.title}</h3>
                  <p className="text-sm text-gray-600">{form.description}</p>
                  <p className="text-xs text-gray-500">
                    Created At: {new Date(form.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm mt-2">
                    <span className="font-semibold">Shareable Link: </span>
                    <a
                      href={`/share/${form.urlId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      https://form-craft-eight.vercel.app/share/{form.urlId}
                    </a>
                  </p>
                </div>
                <Card className="h-12 w-32 flex justify-center items-center p-2">
                  <p className="font-semibold text-[12px]">Form Submissions</p>
                  <p className="rounded-xl  font-semibold text-[18px]">
                    {" "}
                    {form.submissionCount}
                  </p>
                </Card>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => router.push(`/forms/edit/${form.id}`)}
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      duplicateForm(form);
                    }}
                  >
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteForm(form.id)}
                  >
                    <Trash className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SidebarDemo;
