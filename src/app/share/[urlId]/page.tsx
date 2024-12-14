/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { hatch } from "ldrs";
import { useParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileUpload } from "@/components/ui/file-upload";
import { Label } from "@/components/ui/label";

hatch.register();

export default function PublicFormPage() {
  const { urlId } = useParams();
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    console.log("Responses:", responses);
    console.log("Errors:", errors);
  }, [responses, errors]);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await fetch(`/api/share/${urlId}`);
        if (res.ok) {
          const data = await res.json();
          setForm(data);
        } else {
          throw new Error("Failed to load form.");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to load the form. ${error}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [urlId]);

  const cleanResponses = Object.fromEntries(
    Object.entries(responses).map(([key, value]) => {
      if (Array.isArray(value)) {
        // Filter out empty objects in arrays (e.g., for checkbox responses)
        const filtered = value.filter((item) => Object.keys(item).length > 0);
        return [key, filtered];
      }
      return [key, value];
    })
  );

  console.log("Cleaned responses:", cleanResponses);

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch(`/api/forms/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          urlId,
          responses: cleanResponses, // Use cleaned responses
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("API Error Response:", errorData);
        throw new Error(errorData.message || "Failed to submit the form.");
      }

      toast({
        title: "Form submitted",
        description: "Your response has been successfully submitted.",
        variant: "default",
      });
      setResponses({});
    } catch (error) {
      console.error("Submission Error:", error);
      toast({
        title: "Error",
        description: `Failed to submit the form. ${error}`,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
        <l-hatch size="28" stroke="4" speed="3.5" color="black"></l-hatch>
        <p className="text-lg text-gray-600">Loading form...</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-500">Form not found.</p>
      </div>
    );
  }

  const generateKey = (field: { id: string; label: string }) => {
    // Uniform key generation for fields
    const sanitizedLabel = field.label
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/[^\w-]/g, ""); // Remove special characters
    return `${field.id}_${sanitizedLabel}`;
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    form?.fields.forEach((field: any) => {
      const key = generateKey(field);
      const value = responses[key];

      // Skip validation for specific field types
      if (field.type === "heading") {
        return;
      }

      if (field.required) {
        if (
          (field.type === "checkbox" && (!value || value.length === 0)) || // Checkbox validation
          !value // General validation
        ) {
          newErrors[key] = `${field.label} is required.`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Validation passes if no errors
  };

  const handleFieldChange = (
    field: { id: string; label: string },
    value: any
  ) => {
    const key = generateKey(field);
    setResponses((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (value && newErrors[key]) {
        delete newErrors[key]; // Remove the error for the field if valid
      }
      return newErrors;
    });
  };

  const handleFieldBlur = (
    field: { id: string; label: string },
    value: any,
    required: boolean
  ) => {
    const key = generateKey(field);
    if (required && (!value || (Array.isArray(value) && value.length === 0))) {
      setErrors((prev) => ({
        ...prev,
        [key]: `${field.label} is required.`,
      }));
    } else {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const renderField = (field: any) => {
    const key = generateKey(field);
    switch (field.type) {
      case "heading":
        return (
          <h1 className="text-3xl font-bold text-gray-800">{field.label}</h1>
        );
      case "text":
        return (
          <Input
            placeholder={field.label}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            onBlur={(e) =>
              handleFieldBlur(field, e.target.value, field.required)
            }
          />
        );
      case "email":
        return (
          <Input
            type="email"
            placeholder={field.label}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            onBlur={(e) =>
              handleFieldBlur(field, e.target.value, field.required)
            }
          />
        );
      case "address":
        return (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <Input
              placeholder="Street Address"
              onChange={(e) =>
                handleFieldChange(field, {
                  ...responses[key],
                  street: e.target.value,
                })
              }
            />
            <Input
              placeholder="City"
              onChange={(e) =>
                handleFieldChange(field, {
                  ...responses[key],
                  city: e.target.value,
                })
              }
            />
            <Input
              placeholder="State"
              onChange={(e) =>
                handleFieldChange(field, {
                  ...responses[key],
                  state: e.target.value,
                })
              }
            />
            <Input
              placeholder="Postal Code"
              onChange={(e) =>
                handleFieldChange(field, {
                  ...responses[key],
                  postalCode: e.target.value,
                })
              }
            />
          </div>
        );
      case "phone":
        return (
          <Input
            type="tel"
            placeholder={field.label}
            onChange={(e) => handleFieldChange(field, e.target.value)}
          />
        );
      case "date":
        return (
          <Input
            type="date"
            onChange={(e) => handleFieldChange(field, e.target.value)}
          />
        );
      case "dropdown":
        return (
          <Select
            onValueChange={(value) => handleFieldChange(field, value)}
            onBlur={(blurred) => {
              if (blurred) {
                handleFieldBlur(field, responses[key], field.required);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.label} />
            </SelectTrigger>
            <SelectGroup>
              <SelectContent>
                {field.options?.map((option: string, idx: number) => (
                  <SelectItem key={idx} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectGroup>
          </Select>
        );
      case "radio":
        return (
          <RadioGroup
            onValueChange={(value) => handleFieldChange(field, value)}
            onBlur={() =>
              handleFieldBlur(field, responses[key], field.required)
            }
          >
            <p className="mb-2 font-medium">{field.label}</p>
            {field.options?.map((option: string, idx: number) => (
              <RadioGroupItem key={idx} value={option}>
                <span>{option}</span>
              </RadioGroupItem>
            ))}
          </RadioGroup>
        );
      case "checkbox":
        return (
          <div className="space-y-2">
            <p className="font-medium">{field.label}</p>
            {field.options?.map((option: string, idx: number) => (
              <Checkbox
                key={idx}
                onCheckedChange={(checked) => {
                  const checkedOptions = responses[field.id] || [];
                  const updatedOptions = checked
                    ? [...checkedOptions, option]
                    : checkedOptions.filter((opt: string) => opt !== option);
                  handleFieldChange(field, updatedOptions);
                }}
                onBlur={() =>
                  handleFieldBlur(field, responses[key], field.required)
                }
              >
                {option}
              </Checkbox>
            ))}
          </div>
        );
      case "long_text":
        return (
          <Textarea
            placeholder={field.label}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            onBlur={(e) =>
              handleFieldBlur(field, e.target.value, field.required)
            }
          />
        );
      case "file_upload":
        return (
          <FileUpload onChange={(file) => handleFieldChange(field, file)} />
        );
      case "scale":
        return (
          <div>
            <p>Rate on a scale of 1 to 5:</p>
            <div className="flex space-x-4">
              {[1, 2, 3, 4, 5].map((scale) => (
                <Label key={scale} className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    name={`scale-${field.id}`}
                    value={scale}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    onBlur={() =>
                      handleFieldBlur(field, responses[key], field.required)
                    }
                  />
                  <span>{scale}</span>
                </Label>
              ))}
            </div>
          </div>
        );
      default:
        return <p>Unsupported field type</p>;
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-md space-y-6 m-4">
      <h1 className="text-3xl font-bold text-gray-800">{form.title}</h1>
      <p className="text-md text-gray-600">{form.description}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-6"
      >
        {form.fields.map((field: any) => (
          <div key={field.id} className="space-y-2">
            {field.type !== "heading" &&
              field.type !== "page_break" &&
              field.type !== "divider" && (
                <label className="block font-medium text-gray-700">
                  {field.label}
                </label>
              )}
            {renderField(field)}
            {errors[field.id] && (
              <p className="text-red-500 text-sm">{errors[field.id]}</p>
            )}
          </div>
        ))}

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          Submit
        </Button>
      </form>
    </div>
  );
}
