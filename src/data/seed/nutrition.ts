import type { FoodItem, NutritionDay, SavedRecipe } from '../../types';

export const seedFoodDatabase: FoodItem[] = [
  { id: 'f1', name: 'Chicken Breast (grilled)', servingSize: '100g', calories: 165, protein: 31, carbs: 0, fat: 3.6, category: 'Protein' },
  { id: 'f2', name: 'Brown Rice (cooked)', servingSize: '1 cup (195g)', calories: 216, protein: 5, carbs: 45, fat: 1.8, category: 'Grains' },
  { id: 'f3', name: 'Broccoli (steamed)', servingSize: '1 cup (156g)', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, category: 'Vegetables' },
  { id: 'f4', name: 'Eggs (whole, boiled)', servingSize: '2 large', calories: 156, protein: 13, carbs: 1.1, fat: 10.6, category: 'Protein' },
  { id: 'f5', name: 'Oatmeal (dry)', servingSize: '1/2 cup (40g)', calories: 150, protein: 5, carbs: 27, fat: 2.5, category: 'Grains' },
  { id: 'f6', name: 'Banana', servingSize: '1 medium', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, category: 'Fruits' },
  { id: 'f7', name: 'Greek Yogurt (plain)', servingSize: '170g', calories: 100, protein: 17, carbs: 6, fat: 0.7, category: 'Dairy' },
  { id: 'f8', name: 'Salmon (baked)', servingSize: '100g', calories: 208, protein: 20, carbs: 0, fat: 13, category: 'Protein' },
  { id: 'f9', name: 'Sweet Potato (baked)', servingSize: '1 medium', calories: 103, protein: 2.3, carbs: 24, fat: 0.1, category: 'Vegetables' },
  { id: 'f10', name: 'Almonds', servingSize: '28g (1 oz)', calories: 164, protein: 6, carbs: 6, fat: 14, category: 'Nuts' },
  { id: 'f11', name: 'Avocado', servingSize: '1/2 medium', calories: 120, protein: 1.5, carbs: 6, fat: 11, category: 'Fruits' },
  { id: 'f12', name: 'Whey Protein Shake', servingSize: '1 scoop (30g)', calories: 120, protein: 24, carbs: 3, fat: 1.5, category: 'Supplements' },
  { id: 'f13', name: 'Whole Wheat Bread', servingSize: '1 slice', calories: 81, protein: 4, carbs: 14, fat: 1.1, category: 'Grains' },
  { id: 'f14', name: 'Spinach (raw)', servingSize: '2 cups (60g)', calories: 14, protein: 1.7, carbs: 2.2, fat: 0.2, category: 'Vegetables' },
  { id: 'f15', name: 'Peanut Butter', servingSize: '2 tbsp (32g)', calories: 190, protein: 7, carbs: 7, fat: 16, category: 'Nuts' },
  { id: 'f16', name: 'Turkey Breast (deli)', servingSize: '56g (2 oz)', calories: 62, protein: 12, carbs: 1, fat: 1, category: 'Protein' },
  { id: 'f17', name: 'Apple', servingSize: '1 medium', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, category: 'Fruits' },
  { id: 'f18', name: 'Cottage Cheese (low-fat)', servingSize: '1/2 cup', calories: 81, protein: 14, carbs: 3, fat: 1.2, category: 'Dairy' },
  { id: 'f19', name: 'Quinoa (cooked)', servingSize: '1 cup (185g)', calories: 222, protein: 8, carbs: 39, fat: 3.6, category: 'Grains' },
  { id: 'f20', name: 'Blueberries', servingSize: '1 cup (148g)', calories: 84, protein: 1.1, carbs: 21, fat: 0.5, category: 'Fruits' },
  { id: 'f21', name: 'Black Beans (cooked)', servingSize: '1/2 cup', calories: 114, protein: 7.6, carbs: 20, fat: 0.5, category: 'Legumes' },
  { id: 'f22', name: 'Tuna (canned in water)', servingSize: '1 can (142g)', calories: 179, protein: 39, carbs: 0, fat: 1.4, category: 'Protein' },
  { id: 'f23', name: 'Rice Cake', servingSize: '2 cakes', calories: 70, protein: 1.4, carbs: 15, fat: 0.4, category: 'Snacks' },
  { id: 'f24', name: 'Olive Oil', servingSize: '1 tbsp', calories: 119, protein: 0, carbs: 0, fat: 13.5, category: 'Fats' },
  { id: 'f25', name: 'Protein Bar', servingSize: '1 bar (60g)', calories: 210, protein: 20, carbs: 22, fat: 7, category: 'Supplements' },
  { id: 'f26', name: 'Milk (skim)', servingSize: '1 cup (240ml)', calories: 83, protein: 8, carbs: 12, fat: 0.2, category: 'Dairy' },
  { id: 'f27', name: 'White Rice (cooked)', servingSize: '1 cup (186g)', calories: 206, protein: 4.3, carbs: 45, fat: 0.4, category: 'Grains' },
  { id: 'f28', name: 'Tofu (firm)', servingSize: '100g', calories: 76, protein: 8, carbs: 1.9, fat: 4.8, category: 'Protein' },
  { id: 'f29', name: 'Mixed Green Salad', servingSize: '2 cups', calories: 20, protein: 1.5, carbs: 3.5, fat: 0.3, category: 'Vegetables' },
  { id: 'f30', name: 'Dark Chocolate (70%)', servingSize: '30g', calories: 170, protein: 2, carbs: 13, fat: 12, category: 'Snacks' },
];

export const seedNutritionDays: NutritionDay[] = [
  {
    date: '2026-10-25',
    waterIntake: 2200,
    calorieGoal: 2200,
    proteinGoal: 150,
    carbsGoal: 250,
    fatGoal: 70,
    meals: [
      {
        id: 'm1', type: 'breakfast', date: '2026-10-25',
        entries: [
          { id: 'me1', foodId: 'f5', foodName: 'Oatmeal (dry)', servings: 1, servingSize: '1/2 cup', calories: 150, protein: 5, carbs: 27, fat: 2.5 },
          { id: 'me2', foodId: 'f6', foodName: 'Banana', servings: 1, servingSize: '1 medium', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
          { id: 'me3', foodId: 'f12', foodName: 'Whey Protein Shake', servings: 1, servingSize: '1 scoop', calories: 120, protein: 24, carbs: 3, fat: 1.5 },
        ],
      },
      {
        id: 'm2', type: 'lunch', date: '2026-10-25',
        entries: [
          { id: 'me4', foodId: 'f1', foodName: 'Chicken Breast (grilled)', servings: 1.5, servingSize: '100g', calories: 248, protein: 46.5, carbs: 0, fat: 5.4 },
          { id: 'me5', foodId: 'f2', foodName: 'Brown Rice (cooked)', servings: 1, servingSize: '1 cup', calories: 216, protein: 5, carbs: 45, fat: 1.8 },
          { id: 'me6', foodId: 'f3', foodName: 'Broccoli (steamed)', servings: 1, servingSize: '1 cup', calories: 55, protein: 3.7, carbs: 11, fat: 0.6 },
        ],
      },
      {
        id: 'm3', type: 'snack', date: '2026-10-25',
        entries: [
          { id: 'me7', foodId: 'f7', foodName: 'Greek Yogurt (plain)', servings: 1, servingSize: '170g', calories: 100, protein: 17, carbs: 6, fat: 0.7 },
          { id: 'me8', foodId: 'f10', foodName: 'Almonds', servings: 1, servingSize: '28g', calories: 164, protein: 6, carbs: 6, fat: 14 },
        ],
      },
      {
        id: 'm4', type: 'dinner', date: '2026-10-25',
        entries: [
          { id: 'me9', foodId: 'f8', foodName: 'Salmon (baked)', servings: 1.5, servingSize: '100g', calories: 312, protein: 30, carbs: 0, fat: 19.5 },
          { id: 'me10', foodId: 'f9', foodName: 'Sweet Potato (baked)', servings: 1, servingSize: '1 medium', calories: 103, protein: 2.3, carbs: 24, fat: 0.1 },
          { id: 'me11', foodId: 'f29', foodName: 'Mixed Green Salad', servings: 1, servingSize: '2 cups', calories: 20, protein: 1.5, carbs: 3.5, fat: 0.3 },
        ],
      },
    ],
  },
  {
    date: '2026-10-24',
    waterIntake: 1800,
    calorieGoal: 2200,
    proteinGoal: 150,
    carbsGoal: 250,
    fatGoal: 70,
    meals: [
      {
        id: 'm5', type: 'breakfast', date: '2026-10-24',
        entries: [
          { id: 'me12', foodId: 'f4', foodName: 'Eggs (whole, boiled)', servings: 1, servingSize: '2 large', calories: 156, protein: 13, carbs: 1.1, fat: 10.6 },
          { id: 'me13', foodId: 'f13', foodName: 'Whole Wheat Bread', servings: 2, servingSize: '1 slice', calories: 162, protein: 8, carbs: 28, fat: 2.2 },
        ],
      },
      {
        id: 'm6', type: 'lunch', date: '2026-10-24',
        entries: [
          { id: 'me14', foodId: 'f22', foodName: 'Tuna (canned)', servings: 1, servingSize: '1 can', calories: 179, protein: 39, carbs: 0, fat: 1.4 },
          { id: 'me15', foodId: 'f19', foodName: 'Quinoa (cooked)', servings: 1, servingSize: '1 cup', calories: 222, protein: 8, carbs: 39, fat: 3.6 },
        ],
      },
      {
        id: 'm7', type: 'dinner', date: '2026-10-24',
        entries: [
          { id: 'me16', foodId: 'f1', foodName: 'Chicken Breast (grilled)', servings: 1, servingSize: '100g', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
          { id: 'me17', foodId: 'f27', foodName: 'White Rice (cooked)', servings: 1, servingSize: '1 cup', calories: 206, protein: 4.3, carbs: 45, fat: 0.4 },
        ],
      },
    ],
  },
  {
    date: '2026-10-23',
    waterIntake: 2500,
    calorieGoal: 2200,
    proteinGoal: 150,
    carbsGoal: 250,
    fatGoal: 70,
    meals: [
      {
        id: 'm8', type: 'breakfast', date: '2026-10-23',
        entries: [
          { id: 'me18', foodId: 'f7', foodName: 'Greek Yogurt (plain)', servings: 1, servingSize: '170g', calories: 100, protein: 17, carbs: 6, fat: 0.7 },
          { id: 'me19', foodId: 'f20', foodName: 'Blueberries', servings: 1, servingSize: '1 cup', calories: 84, protein: 1.1, carbs: 21, fat: 0.5 },
          { id: 'me20', foodId: 'f5', foodName: 'Oatmeal (dry)', servings: 1, servingSize: '1/2 cup', calories: 150, protein: 5, carbs: 27, fat: 2.5 },
        ],
      },
      {
        id: 'm9', type: 'lunch', date: '2026-10-23',
        entries: [
          { id: 'me21', foodId: 'f28', foodName: 'Tofu (firm)', servings: 2, servingSize: '100g', calories: 152, protein: 16, carbs: 3.8, fat: 9.6 },
          { id: 'me22', foodId: 'f2', foodName: 'Brown Rice (cooked)', servings: 1, servingSize: '1 cup', calories: 216, protein: 5, carbs: 45, fat: 1.8 },
        ],
      },
      {
        id: 'm10', type: 'dinner', date: '2026-10-23',
        entries: [
          { id: 'me23', foodId: 'f8', foodName: 'Salmon (baked)', servings: 1, servingSize: '100g', calories: 208, protein: 20, carbs: 0, fat: 13 },
          { id: 'me24', foodId: 'f9', foodName: 'Sweet Potato (baked)', servings: 1, servingSize: '1 medium', calories: 103, protein: 2.3, carbs: 24, fat: 0.1 },
        ],
      },
    ],
  },
];

export const seedSavedRecipes: SavedRecipe[] = [
  {
    id: 'recipe-1',
    name: 'High-Protein Breakfast Bowl',
    servings: 1,
    totalCalories: 475,
    totalProtein: 42,
    totalCarbs: 51,
    totalFat: 10,
    ingredients: [
      { id: 'ri1', foodId: 'f5', foodName: 'Oatmeal', servings: 1, servingSize: '1/2 cup', calories: 150, protein: 5, carbs: 27, fat: 2.5 },
      { id: 'ri2', foodId: 'f12', foodName: 'Whey Protein', servings: 1, servingSize: '1 scoop', calories: 120, protein: 24, carbs: 3, fat: 1.5 },
      { id: 'ri3', foodId: 'f6', foodName: 'Banana', servings: 1, servingSize: '1 medium', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
      { id: 'ri4', foodId: 'f20', foodName: 'Blueberries', servings: 0.5, servingSize: '1/2 cup', calories: 42, protein: 0.6, carbs: 10.5, fat: 0.3 },
    ],
    instructions: [
      'Cook oatmeal with water or milk.',
      'Stir in protein powder while still warm.',
      'Top with sliced banana and blueberries.',
      'Optional: drizzle with honey.',
    ],
  },
  {
    id: 'recipe-2',
    name: 'Chicken & Rice Meal Prep',
    servings: 4,
    totalCalories: 436,
    totalProtein: 39,
    totalCarbs: 56,
    totalFat: 6,
    ingredients: [
      { id: 'ri5', foodId: 'f1', foodName: 'Chicken Breast', servings: 1, servingSize: '100g', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
      { id: 'ri6', foodId: 'f2', foodName: 'Brown Rice', servings: 1, servingSize: '1 cup', calories: 216, protein: 5, carbs: 45, fat: 1.8 },
      { id: 'ri7', foodId: 'f3', foodName: 'Broccoli', servings: 1, servingSize: '1 cup', calories: 55, protein: 3.7, carbs: 11, fat: 0.6 },
    ],
    instructions: [
      'Season chicken breasts with garlic, paprika, salt and pepper.',
      'Grill or bake chicken at 200°C for 20 minutes.',
      'Cook brown rice according to package directions.',
      'Steam broccoli until tender-crisp.',
      'Divide into 4 containers for the week.',
    ],
  },
];
