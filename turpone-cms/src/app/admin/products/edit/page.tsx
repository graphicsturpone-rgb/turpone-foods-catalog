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
    description: "",
    ingredients: "",
    features: "",
  });

  useEffect(() => {
    if (!isNew && id) {
      const fetchProduct = async () => {
        try {
          const docRef = doc(db, "products", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setFormData(docSnap.data() as any);
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
      if (isNew) {
        await addDoc(collection(db, "products"), formData);
      } else if (id) {
        await setDoc(doc(db, "products", id), formData, { merge: true });
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
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isNew ? "Add New Product" : "Edit Product"}</h1>
        </div>
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="title">Product Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" value={formData.category} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image Filename</Label>
                <Input id="image" name="image" value={formData.image} onChange={handleChange} placeholder="e.g. pizza.png" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients</Label>
              <textarea 
                id="ingredients" 
                name="ingredients" 
                value={formData.ingredients} 
                onChange={handleChange} 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

          </CardContent>
          <div className="px-6 py-4 border-t flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Product"}
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
