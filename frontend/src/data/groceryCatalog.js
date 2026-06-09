// 100+ common grocery store products
// Retailers can pick from these and set their own price

const GROCERY_CATALOG = [
  // ── Grains & Pulses ──────────────────────────────────────
  { name: 'Basmati Rice',       category: 'Grains & Pulses', unit_type: 'kg',     suggested_price: 90  },
  { name: 'Sona Masoori Rice',  category: 'Grains & Pulses', unit_type: 'kg',     suggested_price: 55  },
  { name: 'Wheat Flour (Atta)', category: 'Grains & Pulses', unit_type: 'kg',     suggested_price: 45  },
  { name: 'Maida',              category: 'Grains & Pulses', unit_type: 'kg',     suggested_price: 40  },
  { name: 'Sooji (Semolina)',   category: 'Grains & Pulses', unit_type: 'kg',     suggested_price: 42  },
  { name: 'Besan (Gram Flour)', category: 'Grains & Pulses', unit_type: 'kg',     suggested_price: 60  },
  { name: 'Toor Dal',           category: 'Grains & Pulses', unit_type: 'kg',     suggested_price: 130 },
  { name: 'Chana Dal',          category: 'Grains & Pulses', unit_type: 'kg',     suggested_price: 90  },
  { name: 'Moong Dal',          category: 'Grains & Pulses', unit_type: 'kg',     suggested_price: 110 },
  { name: 'Urad Dal',           category: 'Grains & Pulses', unit_type: 'kg',     suggested_price: 120 },
  { name: 'Masoor Dal',         category: 'Grains & Pulses', unit_type: 'kg',     suggested_price: 95  },
  { name: 'Rajma',              category: 'Grains & Pulses', unit_type: 'kg',     suggested_price: 140 },
  { name: 'Chole (Chick Peas)', category: 'Grains & Pulses', unit_type: 'kg',     suggested_price: 100 },
  { name: 'Poha (Flattened Rice)',category:'Grains & Pulses', unit_type:'kg',     suggested_price: 60  },
  { name: 'Oats',               category: 'Grains & Pulses', unit_type: 'kg',     suggested_price: 150 },

  // ── Oils & Ghee ──────────────────────────────────────────
  { name: 'Sunflower Oil',      category: 'Oils & Ghee',     unit_type: 'liter',  suggested_price: 135 },
  { name: 'Mustard Oil',        category: 'Oils & Ghee',     unit_type: 'liter',  suggested_price: 180 },
  { name: 'Groundnut Oil',      category: 'Oils & Ghee',     unit_type: 'liter',  suggested_price: 200 },
  { name: 'Coconut Oil',        category: 'Oils & Ghee',     unit_type: 'liter',  suggested_price: 220 },
  { name: 'Refined Oil',        category: 'Oils & Ghee',     unit_type: 'liter',  suggested_price: 130 },
  { name: 'Desi Ghee',          category: 'Oils & Ghee',     unit_type: 'kg',     suggested_price: 550 },
  { name: 'Vanaspati Ghee',     category: 'Oils & Ghee',     unit_type: 'kg',     suggested_price: 130 },

  // ── Spices & Condiments ──────────────────────────────────
  { name: 'Salt (Iodised)',     category: 'Spices & Condiments', unit_type: 'kg',  suggested_price: 20  },
  { name: 'Sugar',              category: 'Spices & Condiments', unit_type: 'kg',  suggested_price: 45  },
  { name: 'Jaggery',            category: 'Spices & Condiments', unit_type: 'kg',  suggested_price: 60  },
  { name: 'Turmeric Powder',    category: 'Spices & Condiments', unit_type: 'packet',suggested_price:30 },
  { name: 'Red Chilli Powder',  category: 'Spices & Condiments', unit_type: 'packet',suggested_price:40 },
  { name: 'Coriander Powder',   category: 'Spices & Condiments', unit_type: 'packet',suggested_price:35 },
  { name: 'Cumin (Jeera)',      category: 'Spices & Condiments', unit_type: 'packet',suggested_price:60 },
  { name: 'Mustard Seeds',      category: 'Spices & Condiments', unit_type: 'packet',suggested_price:30 },
  { name: 'Garam Masala',       category: 'Spices & Condiments', unit_type: 'packet',suggested_price:55 },
  { name: 'Chicken Masala',     category: 'Spices & Condiments', unit_type: 'packet',suggested_price:60 },
  { name: 'Biryani Masala',     category: 'Spices & Condiments', unit_type: 'packet',suggested_price:55 },
  { name: 'Black Pepper',       category: 'Spices & Condiments', unit_type: 'packet',suggested_price:80 },
  { name: 'Cardamom',           category: 'Spices & Condiments', unit_type: 'packet',suggested_price:120},
  { name: 'Cloves',             category: 'Spices & Condiments', unit_type: 'packet',suggested_price:100},
  { name: 'Cinnamon',           category: 'Spices & Condiments', unit_type: 'packet',suggested_price:80 },
  { name: 'Tomato Ketchup',     category: 'Spices & Condiments', unit_type: 'packet',suggested_price:95 },
  { name: 'Green Chutney',      category: 'Spices & Condiments', unit_type: 'packet',suggested_price:45 },
  { name: 'Soy Sauce',          category: 'Spices & Condiments', unit_type: 'packet',suggested_price:85 },
  { name: 'Vinegar',            category: 'Spices & Condiments', unit_type: 'packet',suggested_price:50 },

  // ── Sugar & Sweet ────────────────────────────────────────
  { name: 'Honey',              category: 'Spices & Condiments', unit_type: 'packet',suggested_price:180},
  { name: 'Jam',                category: 'Snacks',              unit_type: 'packet',suggested_price:85 },

  // ── Dairy & Eggs ─────────────────────────────────────────
  { name: 'Full Cream Milk',    category: 'Dairy & Eggs',     unit_type: 'liter',  suggested_price: 60  },
  { name: 'Toned Milk',         category: 'Dairy & Eggs',     unit_type: 'liter',  suggested_price: 52  },
  { name: 'Curd (Dahi)',        category: 'Dairy & Eggs',     unit_type: 'kg',     suggested_price: 65  },
  { name: 'Paneer',             category: 'Dairy & Eggs',     unit_type: 'kg',     suggested_price: 380 },
  { name: 'Butter',             category: 'Dairy & Eggs',     unit_type: 'packet', suggested_price: 55  },
  { name: 'Cheese Slices',      category: 'Dairy & Eggs',     unit_type: 'packet', suggested_price: 120 },
  { name: 'Eggs (tray of 12)',  category: 'Dairy & Eggs',     unit_type: 'piece',  suggested_price: 75  },
  { name: 'Condensed Milk',     category: 'Dairy & Eggs',     unit_type: 'packet', suggested_price: 90  },
  { name: 'Milk Powder',        category: 'Dairy & Eggs',     unit_type: 'kg',     suggested_price: 350 },

  // ── Beverages ────────────────────────────────────────────
  { name: 'Tea (Chai Patti)',   category: 'Beverages',        unit_type: 'packet', suggested_price: 120 },
  { name: 'Coffee Powder',      category: 'Beverages',        unit_type: 'packet', suggested_price: 200 },
  { name: 'Instant Coffee',     category: 'Beverages',        unit_type: 'packet', suggested_price: 280 },
  { name: 'Green Tea',          category: 'Beverages',        unit_type: 'packet', suggested_price: 150 },
  { name: 'Bournvita',          category: 'Beverages',        unit_type: 'packet', suggested_price: 220 },
  { name: 'Horlicks',           category: 'Beverages',        unit_type: 'packet', suggested_price: 250 },
  { name: 'Complan',            category: 'Beverages',        unit_type: 'packet', suggested_price: 280 },
  { name: 'Cold Drink (Cola)',  category: 'Beverages',        unit_type: 'piece',  suggested_price: 40  },
  { name: 'Mineral Water',      category: 'Beverages',        unit_type: 'piece',  suggested_price: 20  },
  { name: 'Fruit Juice',        category: 'Beverages',        unit_type: 'packet', suggested_price: 90  },

  // ── Snacks ───────────────────────────────────────────────
  { name: 'Biscuits (Parle-G)', category: 'Snacks',           unit_type: 'packet', suggested_price: 10  },
  { name: 'Marie Biscuit',      category: 'Snacks',           unit_type: 'packet', suggested_price: 30  },
  { name: 'Chips (Lays)',       category: 'Snacks',           unit_type: 'packet', suggested_price: 20  },
  { name: 'Namkeen',            category: 'Snacks',           unit_type: 'packet', suggested_price: 30  },
  { name: 'Mathri',             category: 'Snacks',           unit_type: 'packet', suggested_price: 50  },
  { name: 'Popcorn',            category: 'Snacks',           unit_type: 'packet', suggested_price: 25  },
  { name: 'Instant Noodles (Maggi)', category:'Snacks',       unit_type: 'packet', suggested_price: 15  },
  { name: 'Bread',              category: 'Bakery',           unit_type: 'piece',  suggested_price: 45  },
  { name: 'Pav (Dinner Rolls)', category: 'Bakery',           unit_type: 'packet', suggested_price: 30  },
  { name: 'Rusk',               category: 'Snacks',           unit_type: 'packet', suggested_price: 40  },
  { name: 'Chocolate Bar',      category: 'Snacks',           unit_type: 'piece',  suggested_price: 40  },
  { name: 'Candy',              category: 'Snacks',           unit_type: 'packet', suggested_price: 10  },

  // ── Cleaning ─────────────────────────────────────────────
  { name: 'Surf Excel',         category: 'Cleaning',         unit_type: 'kg',     suggested_price: 120 },
  { name: 'Tide Detergent',     category: 'Cleaning',         unit_type: 'kg',     suggested_price: 100 },
  { name: 'Vim Dish Wash Bar',  category: 'Cleaning',         unit_type: 'piece',  suggested_price: 18  },
  { name: 'Dish Wash Liquid',   category: 'Cleaning',         unit_type: 'packet', suggested_price: 90  },
  { name: 'Colin Glass Cleaner',category: 'Cleaning',         unit_type: 'packet', suggested_price: 90  },
  { name: 'Harpic Toilet Cleaner',category:'Cleaning',        unit_type: 'packet', suggested_price: 95  },
  { name: 'Lizol Floor Cleaner',category: 'Cleaning',         unit_type: 'liter',  suggested_price: 130 },
  { name: 'Phenyl',             category: 'Cleaning',         unit_type: 'liter',  suggested_price: 60  },
  { name: 'Dettol Disinfectant',category: 'Cleaning',         unit_type: 'packet', suggested_price: 115 },
  { name: 'Broom (Jhadoo)',     category: 'Cleaning',         unit_type: 'piece',  suggested_price: 80  },
  { name: 'Mop',                category: 'Cleaning',         unit_type: 'piece',  suggested_price: 150 },

  // ── Personal Care ────────────────────────────────────────
  { name: 'Colgate Toothpaste', category: 'Personal Care',    unit_type: 'packet', suggested_price: 75  },
  { name: 'Pepsodent Toothpaste',category:'Personal Care',    unit_type: 'packet', suggested_price: 60  },
  { name: 'Toothbrush',         category: 'Personal Care',    unit_type: 'piece',  suggested_price: 35  },
  { name: 'Lux Soap',           category: 'Personal Care',    unit_type: 'piece',  suggested_price: 50  },
  { name: 'Dettol Soap',        category: 'Personal Care',    unit_type: 'piece',  suggested_price: 55  },
  { name: 'Lifebuoy Soap',      category: 'Personal Care',    unit_type: 'piece',  suggested_price: 40  },
  { name: 'Head & Shoulders',   category: 'Personal Care',    unit_type: 'packet', suggested_price: 180 },
  { name: 'Sunsilk Shampoo',    category: 'Personal Care',    unit_type: 'packet', suggested_price: 150 },
  { name: 'Pantene Shampoo',    category: 'Personal Care',    unit_type: 'packet', suggested_price: 200 },
  { name: 'Parachute Hair Oil', category: 'Personal Care',    unit_type: 'packet', suggested_price: 90  },
  { name: 'Vaseline',           category: 'Personal Care',    unit_type: 'packet', suggested_price: 80  },
  { name: 'Fair & Lovely Cream',category: 'Personal Care',    unit_type: 'packet', suggested_price: 90  },
  { name: 'Dove Cream',         category: 'Personal Care',    unit_type: 'packet', suggested_price: 120 },
  { name: 'Deo Spray',          category: 'Personal Care',    unit_type: 'piece',  suggested_price: 180 },
  { name: 'Sanitary Pads',      category: 'Personal Care',    unit_type: 'packet', suggested_price: 65  },
  { name: 'Razor Blades',       category: 'Personal Care',    unit_type: 'packet', suggested_price: 30  },
  { name: 'Cotton Ear Buds',    category: 'Personal Care',    unit_type: 'packet', suggested_price: 40  },

  // ── Fruits & Vegetables ──────────────────────────────────
  { name: 'Onion',              category: 'Fruits & Vegetables', unit_type: 'kg',  suggested_price: 30  },
  { name: 'Potato',             category: 'Fruits & Vegetables', unit_type: 'kg',  suggested_price: 25  },
  { name: 'Tomato',             category: 'Fruits & Vegetables', unit_type: 'kg',  suggested_price: 40  },
  { name: 'Garlic',             category: 'Fruits & Vegetables', unit_type: 'kg',  suggested_price: 200 },
  { name: 'Ginger',             category: 'Fruits & Vegetables', unit_type: 'kg',  suggested_price: 150 },
  { name: 'Lemon',              category: 'Fruits & Vegetables', unit_type: 'kg',  suggested_price: 80  },
  { name: 'Banana',             category: 'Fruits & Vegetables', unit_type: 'piece',suggested_price: 5  },
  { name: 'Apple',              category: 'Fruits & Vegetables', unit_type: 'kg',  suggested_price: 180 },

  // ── Frozen Foods ─────────────────────────────────────────
  { name: 'Frozen Peas',        category: 'Frozen Foods',     unit_type: 'packet', suggested_price: 60  },
  { name: 'Frozen Corn',        category: 'Frozen Foods',     unit_type: 'packet', suggested_price: 70  },
  { name: 'Ice Cream',          category: 'Frozen Foods',     unit_type: 'piece',  suggested_price: 30  },
];

export default GROCERY_CATALOG;
