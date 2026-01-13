const products = [
  // Hot Beverages
  { id: 'drink_01', name: 'Masala Chai', price: 25, type: 'drink', description: '1 cup (150 ml)' },
  { id: 'drink_02', name: 'Normal Chai', price: 20, type: 'drink', description: '1 cup (150 ml)' },
  { id: 'drink_03', name: 'Filter Coffee', price: 50, type: 'drink', description: '1 cup (150 ml)' },

  // Cold Beverages
  { id: 'drink_06', name: 'Pepsi 500 ml', price: 35, type: 'drink', description: '500 ml bottle' },
  { id: 'drink_07', name: 'Coke 500 ml', price: 30, type: 'drink', description: '500 ml bottle' },
  { id: 'drink_08', name: 'Sprite 500 ml', price: 35, type: 'drink', description: '500 ml bottle' },
  { id: 'drink_09', name: 'Jaljeera 500 ml', price: 30, type: 'drink', description: '500 ml chilled' },

  // Snacks (Veg)
  { id: 'snack_01', name: 'Milk Cake', price: 50, type: 'veg', description: '100 gm piece' },
  { id: 'snack_02', name: 'Samosa (2 pcs)', price: 30, type: 'veg', description: '2 pieces' },
  { id: 'snack_03', name: 'Paneer Cheese Roll', price: 60, type: 'veg', description: '1 roll (150 gm)' },
  { id: 'snack_04', name: 'Veg Momos (4 pcs)', price: 70, type: 'veg', description: '4 pieces' },

  // Street Food (Veg)
  { id: 'street_01', name: 'Pav Bhaji', price: 80, type: 'veg', description: '2 pav + bhaji (250 gm)' },
  { id: 'street_02', name: 'Bhel Puri', price: 40, type: 'veg', description: 'Medium plate' },
  { id: 'street_03', name: 'Masala Dosa', price: 70, type: 'veg', description: '1 dosa with sambar' },
  { id: 'street_04', name: 'Masala Maggi', price: 50, type: 'veg', description: 'Single bowl' },
  { id: 'street_05', name: 'Red Sauce Pasta', price: 70, type: 'veg', description: '250 gm serving' },
  { id: 'street_06', name: 'White Sauce Pasta', price: 72, type: 'veg', description: '250 gm serving' },

  // Meals
  { id: 'meal_01', name: 'Paneer Sandwich', price: 70, type: 'veg', description: '2 bread slices' },
  { id: 'meal_02', name: 'Egg Sandwich', price: 80, type: 'non-veg', description: '2 bread slices' },
  { id: 'meal_03', name: 'Veg Biryani', price: 90, type: 'veg', description: '500 gm plate' },
  { id: 'meal_04', name: 'Chicken Biryani', price: 120, type: 'non-veg', description: '500 gm plate'},

  // Combos
  {
    id: 'combo_veg',
    need: 'Combo',
    name: 'Veg Sandwich + Fries + Cold Drink',
    price: 120,
    type: 'veg',
    description: '',
  },
  {
    id: 'combo_nonveg',
    need: 'Combo',
    name: 'Chicken Sandwich + Fries + Cold Drink',
    price: 150,
    type: 'non-veg',
    description: '',
  },
];

export default products;