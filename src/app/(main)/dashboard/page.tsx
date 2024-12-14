"use client";

import React, { useEffect, useState } from "react";
import { Copy, Edit, PlusCircle, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
  price?: number;
}

export interface Form {
  id: number;
  title: string;
  description: string;
  fields: FormField[]; // Added fields property
  urlId: string;
  createdAt: string;
}

export function SidebarDemo() {
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchForms = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        console.error("No user session found.");
        return;
      }

      const userId = session.user.id;

      const res = await fetch(`/api/forms/list?userId=${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (res.ok) {
        setForms(data);
      } else {
        console.error("Error fetching forms:", data.error);
      }
    } catch (error) {
      console.error("Error fetching forms:", error);
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
        const data = await res.json();
        console.log("API Error Response:", data);
        throw new Error(data.message || "Failed to delete the form.");
      }
      setForms((prevForms) => prevForms.filter((form) => form.id !== id));

      toast({
        title: "Form deleted",
        description: "The form was successfully deleted.",
        variant: "default",
      });

      // Refetch the forms after deletion
      fetchForms();
    } catch (error) {
      console.log("Error deleting form:", error);
      toast({
        title: "Error",
        description: `Failed to delete the form. ${error}`,
        variant: "destructive",
      });
    }
  };

  const duplicateForm = async (form: Form) => {
    try {
      const session = (await supabase.auth.getSession()).data.session;

      if (!session) {
        throw new Error("No active session");
      }

      const res = await fetch("/api/forms/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          title: `${form.title} (Copy)`,
          description: form.description,
          fields: form.fields,
        }),
      });

      if (res.ok) {
        toast({
          title: "Form duplicated",
          description: "The form was successfully duplicated.",
          variant: "default",
        });
        // Fetch updated forms
        fetchForms();
      } else {
        throw new Error("Failed to duplicate the form.");
      }
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
                      https://localhost:3000/share/{form.urlId}
                    </a>
                  </p>
                </div>
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
                    onClick={() => duplicateForm(form)}
                  >
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteForm(form.id)}
                  >
                    <Trash className="w-4 h-4" />
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
