"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { products, categories, type Product } from "@/lib/mock-data/products";
import { Star, Search, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCatalogProps {
  onAddToCart: (product: Product, quantity: number) => void;
  searchQuery?: string;
  selectedCategory?: string;
}

export function ProductCatalog({
  onAddToCart,
  searchQuery = "",
  selectedCategory = "All",
}: ProductCatalogProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [localCategory, setLocalCategory] = useState(selectedCategory);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      product.description.toLowerCase().includes(localSearch.toLowerCase()) ||
      product.tags.some((tag) =>
        tag.toLowerCase().includes(localSearch.toLowerCase()),
      );
    const matchesCategory =
      localCategory === "All" || product.category === localCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={localCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setLocalCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No products found matching your criteria.
        </div>
      )}
    </div>
  );
}

function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}) {
  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base line-clamp-2">
            {product.name}
          </CardTitle>
          {product.tags.includes("bestseller") && (
            <Badge
              variant="secondary"
              className="shrink-0 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
            >
              Bestseller
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1 text-yellow-600">
            <Star className="h-4 w-4 fill-current" />
            <span className="font-medium">{product.rating}</span>
          </div>
          <span className="text-muted-foreground">
            ({product.reviews.toLocaleString()} reviews)
          </span>
        </div>
        <Badge variant="outline" className="mt-2">
          {product.category}
        </Badge>
      </CardContent>
      <CardFooter className="pt-2 flex items-center justify-between">
        <div className="text-lg font-bold">${product.price.toFixed(2)}</div>
        <Button
          size="sm"
          onClick={() => onAddToCart(product, 1)}
          disabled={!product.inStock}
          className={cn(!product.inStock && "opacity-50")}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
}
