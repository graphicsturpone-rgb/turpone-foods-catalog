"use client";

import { useEffect, useState, Suspense } from "react";
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isNew = id === "new" || !id;
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    image: "",
    gallery: "",
    description: "",
    features: "",
    ingredients: "",
    nutrition: "",
    storage: "",
  });

  useEffect(() => {
    if (!isNew && id) {
      const fetchProduct = async () => {
        try {
          const docRef = doc(db, "products", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as any;
            setFormData({
              title: data.title || "",
              category: data.category || "",
              image: data.image || "",
              gallery: Array.isArray(data.gallery) ? data.gallery.join(", ") : (data.gallery || ""),
              description: data.description || "",
              features: data.features || "",
              ingredients: data.ingredients || "",
              nutrition: data.nutrition || "",
              storage: data.storage || "",
            });
          }
        } catch (error) {
          console.error("Error fetching document:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [isNew, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const payload: any = {
        ...formData,
        gallery: formData.gallery
          ? formData.gallery.split(",").map((s: string) => s.trim()).filter(Boolean)
          : []
      };

      if (isNew) {
        await addDoc(collection(db, "products"), payload);
      } else if (id) {
        await setDoc(doc(db, "products", id), payload, { merge: true });
      }
      router.push("/admin/products");
    } catch (error) {
      console.error("Error saving document: ", error);
      alert("Error saving document");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isNew ? "Add New Product" : "Edit Product"}</h1>
          <p className="text-sm text-muted-foreground">Manage product specifications and detail page information.</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="title">Product Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Bacon and Caramelized Onions Pinsa" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" value={formData.category} onChange={handleChange} required placeholder="e.g. Frozen Pinsa, Frozen Pizza, Infused Oils..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Main Image (Filename or URL)</Label>
                <Input id="image" name="image" value={formData.image} onChange={handleChange} placeholder="e.g. Bacon-and-Caramelized-Onion-Frozen-Pinsa.webp" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gallery">Gallery Images (comma-separated filenames or URLs)</Label>
              <Input id="gallery" name="gallery" value={formData.gallery} onChange={handleChange} placeholder="e.g. pizza_angle1.webp, pizza_angle2.webp, pizza_box.webp" />
              <p className="text-xs text-muted-foreground">Images in this gallery appear as thumbnails on the product detail page and change the main image on hover.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Main Description (Right Column)</Label>
              <textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows={4}
                className="flex min-h-[90px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Product description displayed prominently on the right of the detail page..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">More Details</Label>
              <textarea 
                id="features" 
                name="features" 
                value={formData.features} 
                onChange={handleChange} 
                rows={3}
                className="flex min-h-[70px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g. Featuring: Alfredo sauce, mozzarella, Parmesan, caramelized onions and bacon"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients</Label>
              <textarea 
                id="ingredients" 
                name="ingredients" 
                value={formData.ingredients} 
                onChange={handleChange} 
                rows={3}
                className="flex min-h-[70px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g. Ingredients: Extra-virgin olive oil, balsamic vinegar, basil, crushed red pepper, garlic..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nutrition">Nutrition Facts</Label>
              <textarea 
                id="nutrition" 
                name="nutrition" 
                value={formData.nutrition} 
                onChange={handleChange} 
                rows={3}
                className="flex min-h-[70px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g. Serving Size: 1 slice (120g). Calories: 280, Fat: 12g, Sodium: 540mg, Carbohydrates: 32g, Protein: 11g..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storage">Instructions / Storage</Label>
              <textarea 
                id="storage" 
                name="storage" 
                value={formData.storage} 
                onChange={handleChange} 
                rows={3}
                className="flex min-h-[70px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g. Keep frozen until ready to bake. Preheat oven to 425°F. Bake directly on center oven rack for 12-14 minutes until crust is golden..."
              />
            </div>

          </CardContent>
          <div className="px-6 py-4 border-t flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving Product..." : "Save Product"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default function ProductEditor() {
  return (
    <Suspense fallback={<div>Loading Editor...</div>}>
      <EditorContent />
    </Suspense>
  );
}
