"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Utensils, Clock, Flame, Sparkles, ArrowRight, Heart } from "lucide-react";

export default function RecipesPage() {
  const recipes = [
    {
      id: "spicy-a2-makhana",
      title: "Crispy A2 Ghee & Pink Salt Roasted Makhana",
      category: "Quick Snack (5 Mins)",
      prepTime: "5 Mins",
      calories: "140 kcal",
      difficulty: "Easy",
      image: "/hero-makhana-bowl.jpg",
      ingredients: [
        "2 Cups Koshi Fresh Raw Makhana (9mm+)",
        "1 tbsp Pure A2 Cow Ghee",
        "1/2 tsp Pink Himalayan Sea Salt",
        "1/4 tsp Roasted Cumin Powder & Black Pepper"
      ],
      steps: [
        "Heat A2 Cow Ghee in a heavy-bottom pan on low flame.",
        "Add Koshi Fresh Raw Makhana and roast slowly for 4-5 minutes until crunchy.",
        "Sprinkle pink salt, cumin, and black pepper.",
        "Toss well and serve warm or store in an airtight container!"
      ]
    },
    {
      id: "makhana-dry-fruit-kheer",
      title: "Royal Mithila Makhana & Dry Fruit Kheer",
      category: "Healthy Dessert",
      prepTime: "20 Mins",
      calories: "220 kcal",
      difficulty: "Medium",
      image: "/hero-gourmet-spices-bg.jpg",
      ingredients: [
        "1.5 Cups Koshi Fresh Raw Makhana",
        "1 Liter Full Cream Organic Milk",
        "1/4 Cup Koshi Fresh Roasted Cashews & Almonds",
        "3-4 Cardamom Pods & Saffron Threads",
        "2 tbsp Organic Jaggery or Honey"
      ],
      steps: [
        "Lightly roast makhana in ghee and coarsely crush half of them.",
        "Boil milk in a thick pan until reduced to 3/4 volume.",
        "Add crushed and whole makhana into boiling milk and simmer for 10 mins.",
        "Garnish with chopped cashews, almonds, saffron strands, and sweeten with jaggery."
      ]
    },
    {
      id: "superfood-trail-mix",
      title: "High-Protein Energy Trail Mix",
      category: "Post-Workout Fuel",
      prepTime: "3 Mins",
      calories: "180 kcal",
      difficulty: "Easy",
      image: "/almonds-seeds-collection.jpg",
      ingredients: [
        "1 Cup Roasted Koshi Makhana",
        "1/2 Cup California Almonds",
        "1/4 Cup Roasted Pumpkin & Flax Seeds",
        "2 tbsp Dried Cranberries or Raisins"
      ],
      steps: [
        "Combine all ingredients in a glass jar.",
        "Shake well to evenly mix nuts, seeds, and crispy makhana.",
        "Grab a handful post-workout or during afternoon office cravings for instant clean energy!"
      ]
    }
  ];

  return (
    <div className="bg-sand/10 min-h-screen pb-20">
      <div className="bg-gradient-to-r from-forest-dark via-forest to-emerald-950 text-ivory pt-28 md:pt-32 pb-16 md:pb-20 mb-12">
        <Container>
          <div className="max-w-3xl text-center mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold-light text-xs font-sans font-bold uppercase tracking-wider">
              <Utensils className="h-3.5 w-3.5" /> Healthy Superfood Recipes
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              Delicious & Nutritious Makhana Dishes
            </h1>
            <p className="text-ivory/80 text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
              Simple, delicious, low-calorie recipes crafted with Koshi Fresh organic jumbo makhana and dry fruits.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="space-y-12 max-w-4xl mx-auto">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-3xl border border-sand/60 overflow-hidden shadow-premium-sm p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
            >
              <div className="md:col-span-5 relative aspect-square rounded-2xl bg-sand/30 overflow-hidden border border-sand/50 shadow-premium-sm">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-3 left-3 bg-forest/90 text-ivory text-[10px] font-sans font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-xs">
                  {recipe.category}
                </span>
              </div>

              <div className="md:col-span-7 space-y-5">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-obsidian mb-2">
                    {recipe.title}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-xs font-sans text-stone">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-forest" /> {recipe.prepTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="h-3.5 w-3.5 text-gold" /> {recipe.calories}
                    </span>
                    <span className="font-medium text-forest bg-forest/10 px-2.5 py-0.5 rounded-full">
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-sans font-bold text-obsidian uppercase tracking-wider">
                    Ingredients:
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-charcoal font-light">
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-forest" />
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 pt-2 border-t border-sand/40">
                  <h4 className="text-xs font-sans font-bold text-obsidian uppercase tracking-wider">
                    Step-by-Step Method:
                  </h4>
                  <ol className="space-y-1.5 text-xs text-stone font-light leading-relaxed">
                    {recipe.steps.map((step, idx) => (
                      <li key={idx} className="flex gap-2">
                        <strong className="text-forest font-bold">{idx + 1}.</strong> {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
