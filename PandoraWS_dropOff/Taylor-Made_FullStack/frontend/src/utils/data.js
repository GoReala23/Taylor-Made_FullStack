const products = [
  {
    category: 'Sweets',
    items: [
      {
        _id: 1,
        name: 'Chocolate Cake',
        price: 15.99,
        description: 'Rich chocolate cake',
        imageUrl: 'http://localhost:5000/Images/products/chocolate_cake.jpg',
      },
      {
        _id: 2,
        name: 'Colorful Macarons',
        price: 10.99,
        description: 'Assorted macarons in various flavors',
        imageUrl: 'http://localhost:5000/Images/products/macarons.jpg',
      },
      {
        _id: 3,
        name: 'Caramel Pudding',
        price: 7.99,
        description: 'Creamy caramel pudding',
        imageUrl: 'http://localhost:5000/Images/products/caramel_pudding.jpg',
      },
      {
        _id: 4,
        name: 'Strawberry Shortcake',
        price: 12.99,
        description: 'Classic strawberry shortcake',
        imageUrl:
          'http://localhost:5000/Images/products/strawberry_shortcake.jpg',
      },
      {
        _id: 5,
        name: 'Fudge Brownies',
        price: 8.99,
        description: 'Dense and chocolatey fudge brownies',
        imageUrl: 'http://localhost:5000/Images/products/fudge_brownies.jpg',
      },
      {
        _id: 6,
        name: 'Vanilla Cupcakes',
        price: 6.99,
        description: 'Vanilla cupcakes with buttercream frosting',
        imageUrl: 'http://localhost:5000/Images/products/vanilla_cupcakes.jpg',
      },
    ],
  },
  {
    category: 'Meals',
    items: [
      {
        _id: 101,
        name: 'Chicken Pasta',
        price: 12.99,
        description: 'Creamy chicken pasta',
        imageUrl: 'http://localhost:5000/Images/products/chicken_pasta.jpg',
      },
      {
        _id: 102,
        name: 'Grilled Steak',
        price: 18.99,
        description: 'Juicy grilled steak with vegetables',
        imageUrl: 'http://localhost:5000/Images/products/steak.jpg',
      },
      {
        _id: 103,
        name: 'Herb-Roasted Chicken',
        price: 15.99,
        description: 'Tender herb-roasted chicken',
        imageUrl: 'http://localhost:5000/Images/products/herb_chicken.jpg',
      },
      {
        _id: 104,
        name: 'Salmon with Lemon',
        price: 19.99,
        description: 'Pan-seared salmon with lemon garnish',
        imageUrl: 'http://localhost:5000/Images/products/salmon.jpg',
      },
      {
        _id: 105,
        name: 'Vegetarian Lasagna',
        price: 13.99,
        description: 'Vegetarian lasagna with layers of veggies',
        imageUrl:
          'http://localhost:5000/Images/products/vegetarian_lasagna.jpg',
      },
      {
        _id: 106,
        name: 'Beef Stir Fry',
        price: 14.99,
        description: 'Savory beef stir fry',
        imageUrl: 'http://localhost:5000/Images/products/beef_stir_fry.jpg',
      },
    ],
  },
  {
    category: 'Breads',
    items: [
      {
        _id: 201,
        name: 'Crusty Baguette',
        price: 3.99,
        description: 'Freshly baked crusty baguette',
        imageUrl: 'http://localhost:5000/Images/products/baguette.jpg',
      },
      {
        _id: 202,
        name: 'Sourdough Loaf',
        price: 5.99,
        description: 'Tangy sourdough loaf',
        imageUrl: 'http://localhost:5000/Images/products/sourdough.jpg',
      },
      {
        _id: 203,
        name: 'Croissants',
        price: 4.99,
        description: 'Flaky and buttery croissants',
        imageUrl: 'http://localhost:5000/Images/products/croissants.webp',
      },
      {
        _id: 204,
        name: 'Whole Wheat Rolls',
        price: 4.49,
        description: 'Healthy whole wheat rolls',
        imageUrl: 'http://localhost:5000/Images/products/wheat_rolls.jpg',
      },
      {
        _id: 205,
        name: 'Focaccia with Herbs',
        price: 5.99,
        description: 'Focaccia topped with herbs',
        imageUrl: 'http://localhost:5000/Images/products/focaccia.jpg',
      },
      {
        _id: 206,
        name: 'Pretzels',
        price: 3.49,
        description: 'Soft and salty pretzels',
        imageUrl: 'http://localhost:5000/Images/products/pretzel.jpg',
      },
    ],
  },
  {
    category: 'Butters',
    items: [
      {
        _id: 301,
        name: 'Peanut Butter',
        price: 3.99,
        description: 'Smooth and creamy peanut butter',
        imageUrl: 'http://localhost:5000/Images/products/peanut_butter.webp',
      },
      {
        _id: 302,
        name: 'Whipped Honey Butter',
        price: 4.99,
        description: 'Honey butter whipped to perfection',
        imageUrl: 'http://localhost:5000/Images/products/honey_butter.jpg',
      },
      {
        _id: 303,
        name: 'Garlic Herb Butter',
        price: 5.49,
        description: 'Butter infused with garlic and herbs',
        imageUrl: 'http://localhost:5000/Images/products/garlic_butter.jpg',
      },
      {
        _id: 304,
        name: 'Almond Butter',
        price: 6.99,
        description: 'Nutty almond butter',
        imageUrl: 'http://localhost:5000/Images/products/almond_butter.webp',
      },
      {
        _id: 305,
        name: 'Chocolate Spread',
        price: 4.99,
        description: 'Rich chocolate spread',
        imageUrl: 'http://localhost:5000/Images/products/chocolate_spread.jpg',
      },
      {
        _id: 306,
        name: 'Cashew Butter',
        price: 7.49,
        description: 'Creamy cashew butter',
        imageUrl: 'http://localhost:5000/Images/products/cashew_butter.JPG',
      },
    ],
  },
  {
    category: 'Others',
    items: [
      {
        _id: 401,
        name: 'Mixed Fruit Salad',
        price: 8.99,
        description: 'Freshly made fruit salad',
        imageUrl: 'http://localhost:5000/Images/products/fruit_salad.jpg',
      },
      {
        _id: 402,
        name: 'Jar of Pickles',
        price: 4.99,
        description: 'Crunchy homemade pickles',
        imageUrl: 'http://localhost:5000/Images/products/pickles.jpg',
      },
      {
        _id: 403,
        name: 'Cheese Platter',
        price: 14.99,
        description: 'Assorted cheeses on a platter',
        imageUrl: 'http://localhost:5000/Images/products/cheese_platter.jpg',
      },
      {
        _id: 404,
        name: 'Sushi Rolls',
        price: 12.99,
        description: 'Freshly prepared sushi rolls',
        imageUrl: 'http://localhost:5000/Images/products/sushi.jpg',
      },
      {
        _id: 405,
        name: 'Boiled Peanuts',
        price: 5.99,
        description: 'Delicious boiled peanuts',
        imageUrl: 'http://localhost:5000/Images/products/boiled_peanuts.jpg',
      },
      {
        _id: 406,
        name: 'Bowl of Guacamole',
        price: 7.49,
        description: 'Creamy guacamole dip',
        imageUrl: 'http://localhost:5000/Images/products/guacamole.jpg',
      },
    ],
  },
  {
    category: 'Featured',
    items: [
      {
        _id: 501,
        name: 'Deluxe Chocolate Cheesecake',
        price: 24.99,
        description:
          'Rich, creamy chocolate cheesecake with a decadent chocolate ganache topping',
        imageUrl:
          'http://localhost:5000/Images/products/chocolate_cheesecake.webp',
        categories: ['Featured', 'Sweets'],
      },
      {
        _id: 502,
        name: 'Gourmet Beef Wellington',
        price: 39.99,
        description:
          'Tender beef fillet wrapped in puff pastry with mushroom duxelles',
        imageUrl: 'http://localhost:5000/Images/products/beef_wellington.webp',
        categories: ['Featured', 'Meals'],
      },
      {
        _id: 503,
        name: 'Rustic Artisan Bread',
        price: 8.99,
        description:
          'Handcrafted sourdough bread with a crispy crust and soft interior',
        imageUrl: 'http://localhost:5000/Images/products/artisan_bread.webp',
        categories: ['Featured', 'Breads'],
      },
      {
        _id: 504,
        name: 'Maple Cinnamon Butter',
        price: 6.99,
        description:
          'Creamy butter infused with pure maple syrup and a hint of cinnamon',
        imageUrl: 'http://localhost:5000/Images/products/cinnamon_butter.webp',
        categories: ['Featured', 'Butters'],
      },
      {
        _id: 505,
        name: 'Exotic Tropical Fruit Platter',
        price: 29.99,
        description:
          'Assortment of fresh, exotic fruits beautifully arranged on a platter',
        imageUrl: 'http://localhost:5000/Images/products/exotic_fruit.webp',
        categories: ['Featured', 'Others'],
      },
    ],
  },
];

export default products;
