/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";

import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";

interface Submission {
  id: string;
  formId: number;
  email: string;
  responses: Record<string, any>;
  createdAt: string;
}

interface FormWithSubmissions {
  formId: number;
  formTitle: string;
  submissions: Submission[];
}

const links = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Submissions",
    href: "/submissions",
    icon: (
      <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Settings",
    href: "/settings",
    icon: (
      <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Logout",
    href: "#",
    icon: (
      <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
];

export default function SubmissionsPage() {
  const [formsWithSubmissions, setFormsWithSubmissions] = useState<
    FormWithSubmissions[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await fetch("/api/forms/submissions");
        const data = await res.json();

        if (res.ok) {
          setFormsWithSubmissions(data);
        } else {
          throw new Error("Failed to fetch submissions.");
        }
      } catch (error) {
        console.error("Error fetching submissions:", error);
        toast({
          title: "Error",
          description: "Failed to load submissions.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) {
    return <p>Loading submissions...</p>;
  }

  if (!formsWithSubmissions.length) {
    return <p>No submissions found.</p>;
  }

  return (
    <div className="p-6 w-full overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Submissions</h1>
      <div className="space-y-4  w-full">
        {formsWithSubmissions.map((form) => (
          <Card
            className="border-[1px] border-neutral-400 w-full rounded-md p-4 bg-neutral-50"
            key={form.formId}
          >
            <Table>
              <TableCaption className="font-bold text-xl text-black underline cursor-pointer">
                {form.formTitle}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-gray-700">
                    Email
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Responses
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Submitted At
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {form.submissions.map((submission) => (
                  <TableRow
                    key={submission.id}
                    className="hover:bg-gray-100 cursor-pointer transition-all duration-200"
                  >
                    <TableCell>{submission.email}</TableCell>
                    <TableCell>
                      <pre className="text-xs">
                        {JSON.stringify(
                          Object.entries(submission.responses).reduce(
                            (acc: Record<string, any>, [key, value]) => {
                              const label = key.split("_").slice(1).join("_");
                              acc[label || key] = value;
                              return acc;
                            },
                            {}
                          ),
                          null,
                          2
                        )}
                      </pre>
                    </TableCell>

                    <TableCell>
                      {new Date(submission.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport(submission)}
                      >
                        Export
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        ))}
      </div>
    </div>
  );
}

const handleExport = (submission: Submission) => {
  // Simplify responses by removing the first part of the key before the underscore
  const simplifiedResponses = Object.entries(submission.responses).reduce(
    (acc: Record<string, any>, [key, value]) => {
      const label = key.split("_").slice(1).join("_"); // Extract meaningful part of the key
      acc[label || key] = value;
      return acc;
    },
    {}
  );

  // Flatten nested responses for better CSV formatting
  const flattenedResponse: Record<string, any> = {};

  Object.entries(simplifiedResponses).forEach(([key, value]) => {
    if (typeof value === "object" && !Array.isArray(value)) {
      // Handle nested objects like address fields
      Object.entries(value).forEach(([subKey, subValue]) => {
        flattenedResponse[`${key}_${subKey}`] = subValue; // Combine parent and child keys
      });
    } else {
      flattenedResponse[key] = value; // Direct assignment for non-nested fields
    }
  });

  // Prepare the CSV data for a single submission
  const csvData = {
    Email: submission.email,
    ...flattenedResponse,
    "Submitted At": new Date(submission.createdAt).toLocaleString(),
  };

  // Generate CSV headers dynamically
  const headers = Object.keys(csvData);

  // Create the CSV content
  const csvContent = [
    headers.join(","), // Header row
    headers
      .map((header) => `"${(csvData as Record<string, string>)[header] || ""}"`)
      .join(","), // Single data row
  ].join("\n");

  // Trigger CSV download
  const dataStr = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute(
    "download",
    `submission_${submission.id}.csv`
  );
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};
