/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Droppable, Draggable, DragDropContext } from "react-beautiful-dnd";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Pickaxe, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import { Field } from "../../create/page";
import Image from "next/image";

const basicFields = [
  { type: "heading", title: "Heading" },
  { type: "text", title: "Short Text" },
  { type: "email", title: "Email" },
  { type: "address", title: "Address" },
  { type: "phone", title: "Phone" },
  { type: "date", title: "Date Picker" },
  { type: "appointment", title: "Appointment" },
  { type: "dropdown", title: "Dropdown" },
  { type: "radio", title: "Single Choice" },
  { type: "checkbox", title: "Multiple Choice" },
];

const additionalFields = [
  { type: "long_text", title: "Long Text" },
  { type: "scale", title: "Scale Rating" },
  { type: "divider", title: "Divider" },
  { type: "page_break", title: "Page Break" },
  { type: "signature", title: "Signature" },
  { type: "file_upload", title: "File Upload" },
  { type: "product_list", title: "Product List" },
  { type: "star_rating", title: "Star Rating" },
];

export default function EditForm() {
  const [formTitle, setFormTitle] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string>("");
  const [fields, setFields] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();
  const { id } = useParams();

  const fetchForm = async () => {
    try {
      const res = await fetch(`/api/forms/${id}`);
      if (res.ok) {
        const data = await res.json();
        const { title, description, fields } = data;

        console.log(fields);
        setFormTitle(title);
        setFormDescription(description);
        setFields(fields);
      } else {
        throw new Error("Failed to load form data.");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "An error occurred while loading the form.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForm();
  }, [id]);

  const updateForm = async () => {
    const formData = {
      title: formTitle,
      description: formDescription,
      fields,
    };

    try {
      const res = await fetch(`/api/forms/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast({
          title: "Form updated successfully!",
          description: "Your changes have been saved.",
          variant: "default",
        });
        router.push("/dashboard");
      } else {
        const data = await res.json();
        toast({
          title: "Failed to update form",
          description: `Error: ${data.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating form:", error);
      toast({
        title: "Failed to update form",
        description: "An error occurred while saving the form.",
        variant: "destructive",
      });
    }
  };

  const addField = (type: string) => {
    const newField = {
      id: nanoid(),
      type,
      label: `Untitled ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      required: false,
      options: ["dropdown", "radio", "product_list"].includes(type)
        ? [""]
        : undefined,
      price: type === "product_list" ? 0 : undefined,
    };
    setFields([...fields, newField]);
  };

  const deleteField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const updateField = (id: string, updates: Partial<any>) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };

  const renderField = (field: Field) => {
    switch (field.type) {
      case "heading":
        return <h1 className="text-2xl font-bold">{field.label}</h1>;
      case "text":
        return <Input placeholder="Short Text" />;
      case "email":
        return <Input type="email" placeholder="Enter Email" />;
      case "address":
        return (
          <div className="space-y-2">
            <Input placeholder="Street Address" />
            <Input placeholder="City" />
            <Input placeholder="State" />
            <Input placeholder="Postal Code" />
          </div>
        );
      case "phone":
        return (
          <Input type="tel" pattern="[0-9]*" placeholder="Enter Phone Number" />
        );
      case "date":
        return <Input type="date" placeholder="Select Date" />;
      case "appointment":
        return <Input type="datetime-local" placeholder="Set Appointment" />;
      case "dropdown":
      case "radio":
      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <Input
                key={index}
                value={option}
                onChange={(e) => {
                  const updatedOptions = [...(field.options || [])];
                  updatedOptions[index] = e.target.value;
                  updateField(field.id, { options: updatedOptions });
                }}
                placeholder="Option"
              />
            ))}
            <Button
              onClick={() =>
                updateField(field.id, {
                  options: [...(field.options || []), ""],
                })
              }
              className="mt-2"
            >
              Add Option
            </Button>
          </div>
        );
      case "long_text":
        return (
          <textarea
            className="w-full border rounded p-2"
            rows={4}
            placeholder="Long Text"
          />
        );
      case "scale":
        return (
          <div>
            <p>Rate on a scale of 1 to 5:</p>
            <div className="flex space-x-4">
              {[1, 2, 3, 4, 5].map((scale) => (
                <label key={scale}>
                  <input
                    type="radio"
                    name={`scale-${field.id}`}
                    value={scale}
                  />
                  {scale}
                </label>
              ))}
            </div>
          </div>
        );

      case "divider":
        return <hr className="my-4" />;
      case "page_break":
        return <div className="border-t-2 border-dashed my-6" />;
      case "signature":
        return (
          <div className="h-24 border rounded bg-gray-100">
            Signature Placeholder
          </div>
        );
      case "file_upload":
        return (
          <FileUpload
            onChange={(files) => updateField(field.id, { file: files[0] })}
          />
        );
      case "image_upload":
        return (
          <>
            <FileUpload
              onChange={(files) => {
                const file = files[0];
                if (file) {
                  const previewUrl = URL.createObjectURL(file);
                  updateField(field.id, { file, previewUrl });
                }
              }}
            />
            {field.previewUrl && (
              <Image
                width={200}
                height={200}
                src={field.previewUrl}
                alt="Preview"
                className="mt-2 max-w-full rounded"
              />
            )}
          </>
        );
      case "product_list":
        return (
          <div className="space-y-4">
            <h3>My Products</h3>
            {field.options?.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex flex-col">
                  <Input
                    value={product}
                    onChange={(e) => {
                      const updatedProducts = [...(field.options || [])];
                      updatedProducts[index] = e.target.value;
                      updateField(field.id, { options: updatedProducts });
                    }}
                    placeholder="Enter Product Name"
                  />
                  <Input
                    type="number"
                    value={field.price}
                    onChange={(e) =>
                      updateField(field.id, { price: Number(e.target.value) })
                    }
                    placeholder="Price"
                    className="mt-2"
                  />
                </div>
                <p className="text-lg font-bold">${field.price || 0}</p>
              </div>
            ))}
            <Button
              onClick={() =>
                updateField(field.id, {
                  options: [...(field.options || []), ""],
                  price: 0,
                })
              }
              className="mt-2"
            >
              Add Product
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const renderPreviewField = (field: Field) => {
    switch (field.type) {
      case "heading":
        return <h1 className="text-2xl font-bold">{field.label}</h1>;
      case "text":
        return <Input placeholder="Short Text" />;
      case "email":
        return <Input type="email" placeholder="Enter Email" />;
      case "address":
        return (
          <div className="space-y-2">
            <Input placeholder="Street Address" />
            <Input placeholder="City" />
            <Input placeholder="State" />
            <Input placeholder="Postal Code" />
          </div>
        );
      case "phone":
        return <Input type="tel" placeholder="Enter Phone Number" />;
      case "date":
        return <Input type="date" />;
      case "appointment":
        return <Input type="datetime-local" />;
      case "radio":
        return (
          <div>
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input type="radio" name={`radio-${field.id}`} value={option} />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div>
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input type="checkbox" value={option} />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      case "long_text":
        return <textarea rows={4} className="w-full border rounded p-2" />;
      case "scale":
        return (
          <div>
            <p>Rate on a scale of 1 to 5:</p>
            <div className="flex space-x-4">
              {[1, 2, 3, 4, 5].map((scale) => (
                <label key={scale} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`scale-${field.id}`}
                    value={scale}
                  />
                  <span>{scale}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case "divider":
        return <hr className="my-4" />;
      case "page_break":
        return <div className="border-t-2 border-dashed my-6" />;
      case "signature":
        return (
          <div className="h-24 border rounded bg-gray-100">
            Signature Placeholder
          </div>
        );
      case "file_upload":
        return <FileUpload onChange={(files) => console.log(files)} />;
      case "image_upload":
        return (
          <div>
            <FileUpload
              onChange={(files) => {
                const file = files[0];
                if (file) {
                  const previewUrl = URL.createObjectURL(file);
                  console.log("Image uploaded:", previewUrl);
                }
              }}
            />
          </div>
        );
      case "product_list":
        return (
          <div className="space-y-4">
            <h3>My Products</h3>
            {field.options?.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <Input value={product} placeholder="Product Name" />
                <Input type="number" placeholder="Price" />
              </div>
            ))}
          </div>
        );
      case "dropdown":
        return (
          <div className="border rounded p-2 bg-white">
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      default:
        return null;
    }
  };

  const previewForm = () => (
    <div className="p-4 border rounded bg-gray-100">
      <h2 className="text-lg font-bold">{formTitle}</h2>
      <p className="text-sm mb-4 text-gray-600">{formDescription}</p>
      {fields.map((fieldItem) => (
        <div key={fieldItem.id} className="mb-4">
          {fieldItem.type !== "heading" &&
            fieldItem.type !== "page_break" &&
            fieldItem.type !== "divider" && (
              <label className="block font-medium mb-2">
                {fieldItem.label}
              </label>
            )}
          {renderPreviewField(fieldItem)}
        </div>
      ))}
      <Button className="w-full mt-4" onClick={() => alert("Form Submitted!")}>
        Submit
      </Button>
    </div>
  );

  if (loading) return <p>Loading form...</p>;

  return (
    <SidebarProvider>
      <Sidebar variant="floating">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                asChild
                onClick={() => router.push("/")}
                className="hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                <div className="gap-2 hover:scale-105 flex flex-row items-evenly">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Pickaxe className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="text-2xl font-bold text-blue-600">
                      FormCraft
                    </span>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="additional">Additional</TabsTrigger>
              </TabsList>
              <TabsContent value="basic">
                <SidebarMenu>
                  {basicFields.map((item) => (
                    <SidebarMenuItem key={item.type}>
                      <SidebarMenuButton onClick={() => addField(item.type)}>
                        {item.title}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </TabsContent>
              <TabsContent value="additional">
                <SidebarMenu>
                  {additionalFields.map((item) => (
                    <SidebarMenuItem key={item.type}>
                      <SidebarMenuButton onClick={() => addField(item.type)}>
                        {item.title}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </TabsContent>
            </Tabs>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex justify-between items-center p-4 bg-gray-50">
          <h1 className="text-xl font-bold">Edit Form</h1>
          <Button
            onClick={updateForm}
            className="w-1/4 m-4 bg-blue-600"
            variant={"default"}
          >
            Save Changes
          </Button>
        </header>
        <Tabs defaultValue="edit">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="edit">Edit From</TabsTrigger>
            <TabsTrigger value="preview">Form Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit">
            <div className="p-4">
              <Input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Form Title"
                className="mb-4"
              />
              <Input
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Form Description"
                className="mb-4"
              />
              <DragDropContext
                onDragEnd={(result) => {
                  const { source, destination } = result;

                  // If dropped outside the droppable area or at the same position
                  if (!destination || source.index === destination.index)
                    return;

                  // Reorder fields array
                  const updatedFields = Array.from(fields);
                  const [movedField] = updatedFields.splice(source.index, 1); // Remove dragged item
                  updatedFields.splice(destination.index, 0, movedField); // Insert at the new index
                  setFields(updatedFields); // Update state
                }}
              >
                <Droppable
                  droppableId="fields"
                  isDropDisabled={false} // Ensure droppable is enabled
                >
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {fields.map((field, index) => (
                        <Draggable
                          key={field.id}
                          draggableId={field.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps} // Attach draggable props
                              {...provided.dragHandleProps} // Attach handle props for the ribbon
                              className="p-4 bg-gray-50 border rounded relative flex items-center"
                            >
                              {/* Dragging Ribbon */}
                              <div
                                className="w-4 h-full bg-blue-600 cursor-grab flex items-center justify-center rounded-l text-white hover:bg-blue-700 transition-all duration-100"
                                title="Drag to reorder"
                              >
                                ||
                              </div>

                              {/* Field Content */}
                              <div className="flex-1 pl-4">
                                <div className="flex justify-between items-center mb-2">
                                  <Input
                                    value={field.label}
                                    onChange={(e) =>
                                      updateField(field.id, {
                                        label: e.target.value,
                                      })
                                    }
                                    placeholder="Field Label"
                                  />
                                </div>
                                {renderField(field)}
                              </div>

                              {/* Delete Button */}
                              <Button
                                variant="destructive"
                                onClick={() => deleteField(field.id)}
                                className="absolute bottom-2 right-2"
                              >
                                <Trash />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </TabsContent>
          <TabsContent value="preview">{previewForm()}</TabsContent>
        </Tabs>
      </SidebarInset>
    </SidebarProvider>
  );
}
