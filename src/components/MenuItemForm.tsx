import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { menuItemSchema, type MenuItem, CATEGORIES } from "@shared/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { UploadCloud } from "lucide-react";
type MenuItemFormValues = z.infer<typeof menuItemSchema>;
interface MenuItemFormProps {
  onSubmit: (data: MenuItemFormValues) => void;
  initialData?: MenuItem | null;
  isSubmitting: boolean;
}
export function MenuItemForm({ onSubmit, initialData, isSubmitting }: MenuItemFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      price: 0,
      category: "Main Courses",
      imageUrl: "",
    },
  });
  useEffect(() => {
    if (initialData?.imageUrl) {
      setImagePreview(initialData.imageUrl);
    }
  }, [initialData]);
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // For mock purposes, we'll just use a placeholder. In a real app, you'd upload this file.
      form.setValue("imageUrl", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop");
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Spaghetti Carbonara" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A classic Italian pasta dish..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" placeholder="15.99" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={() => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-md object-cover" />
                  )}
                  <Label htmlFor="image-upload" className="flex-1 cursor-pointer border-2 border-dashed rounded-md p-4 text-center text-muted-foreground hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))] transition-colors">
                    <UploadCloud className="mx-auto h-6 w-6 mb-2" />
                    <span>{imagePreview ? 'Change Image' : 'Upload an Image'}</span>
                  </Label>
                  <Input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Saving..." : "Save Item"}
        </Button>
      </form>
    </Form>
  );
}