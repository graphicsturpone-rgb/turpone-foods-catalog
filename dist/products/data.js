const productsData = [
  {
    "id": 1,
    "title": "Bacon and Caramelized Onions Pinsa",
    "category": "Frozen Pinsa",
    "image": "Bacon-and-Caramelized-Onion-Frozen-Pinsa.webp",
    "description": "Martha Stewart Bacon and Caramelized Onions Pinsa pairs savory bacon and sweet caramelized onions with creamy Alfredo sauce, mozzarella and Parmesan on a hand-stretched, authentic Roman-style crust. Light and airy with a crisp exterior, the pinsa crust creates the perfect base for this rich, savory and slightly sweet combination. Ready in minutes, it's an effortless way to enjoy a distinctive Roman-inspired meal at home.",
    "features": "Featuring: Alfredo sauce, mozzarella, Parmesan, caramelized onions and bacon"
  },
  {
    "id": 2,
    "title": "Bacon and Caramelized Onions Pizza",
    "category": "Frozen Pizza",
    "image": "Bacon-and-Caramelized-Onions-Frozen-Pizza.webp",
    "description": "Martha Stewart Bacon and Caramelized Onions Pizza pairs savory bacon and sweet caramelized onions with creamy Alfredo sauce, mozzarella and Parmesan on a hand-stretched, stone-baked crust. Rich, savory and slightly sweet, this indulgent combination delivers layers of flavor in every bite. Simply bake until golden for a pizzeria-inspired pizza that's ready to enjoy at home in minutes.",
    "features": "Featuring: Alfredo sauce, mozzarella, Parmesan, caramelized onions and bacon"
  },
  {
    "id": 3,
    "title": "Balsamic Garlic & Herb Infused Extra Virgin Olive Oil",
    "category": "Infused Oils",
    "image": "Balsamic-Garlic-and-Herb-Infused-Extra-Virgin-Olive-Oil.webp",
    "description": "Martha Stewart Balsamic Garlic & Herb Infused Extra Virgin Olive Oil combines extra virgin olive oil with balsamic vinegar, basil, garlic, oregano, thyme and a touch of crushed red pepper. Rich, aromatic and wonderfully versatile, it brings an extra layer of flavor to oven-baked pizzas and makes an effortless base for salad dressings and vinaigrettes. Drizzle it over fresh bread, roasted vegetables or your favorite dishes for an easy finishing touch.",
    "ingredients": "Ingredients: Extra-virgin olive oil, balsamic vinegar, basil, crushed red pepper, garlic, oregano, thyme, natural flavorings (liquid garlic flavor)."
  },
  {
    "id": 4,
    "title": "Cacio e Pepe with Alfredo Sauce Pizza",
    "category": "Frozen Pizza",
    "image": "Cacio-e-Pepe-with-Alfredo-Frozen-Pizza.webp",
    "description": "Martha Stewart Cacio e Pepe with Alfredo Sauce Pizza takes inspiration from the classic Italian pasta dish, pairing creamy Alfredo sauce with Parmesan, Romano cheese, minced garlic and black pepper on a hand-stretched, stone-baked crust. Rich and cheesy with a distinctive peppery finish, this white pizza offers an elevated alternative to traditional tomato-based varieties. Bake until golden for an easy, pizzeria-inspired meal at home.",
    "features": "Featuring: Alfredo sauce, minced garlic, Parmesan, Romano cheese and black pepper"
  },
  {
    "id": 5,
    "title": "Lemon Pepper Infused Extra Virgin Olive Oil",
    "category": "Infused Oils",
    "image": "Lemon-Pepper-Infused-Extra-Virgin-Olive-Oil.webp",
    "description": "Martha Stewart Lemon Pepper Infused Extra Virgin Olive Oil combines extra virgin olive oil with black peppercorns and dried lemon peel for a bright, zesty flavor with a peppery finish. Fresh and versatile, it adds a burst of flavor to oven-baked pizzas and pairs beautifully with grilled fish, roasted chicken and vegetables. Mix it with fresh herbs and lemon juice for a simple, flavorful dressing or marinade.",
    "ingredients": "Ingredients: Extra-virgin olive oil, black peppercorns, dried lemon peel, de arbol peppers, natural flavorings (liquid lemon flavor)."
  },
  {
    "id": 6,
    "title": "Fig Oregano Honey Drizzle",
    "category": "Honeys",
    "image": "MS-Honey-Fig-Oregano-1.webp",
    "description": "Martha Stewart Fig Oregano Honey Drizzle combines raw fig honey with oregano and black pepper for a rich, subtly savory take on traditional honey. Perfect for drizzling over pizza, warm goat cheese or a fresh salad, it also pairs beautifully with grilled lamb and roasted vegetables. The combination of sweet fig, fragrant oregano and black pepper adds a distinctive finishing touch to everything from appetizers to main dishes.",
    "ingredients": "Ingredients: Raw fig honey, black pepper, dried oregano leaves."
  },
  {
    "id": 7,
    "title": "Lemon Black Pepper Honey Drizzle",
    "category": "Honeys",
    "image": "MS-Honey-Lemon-Black-Pepper-1.webp",
    "description": "Martha Stewart Lemon Black Pepper Honey Drizzle brings together raw lemon honey, bright citrus and black pepper for a sweet, zesty flavor with a subtle peppery finish. Drizzle it over pizza, grilled salmon or roasted vegetables, or pair it with cheese for an effortless appetizer. Its balance of sweetness, citrus and pepper makes it a versatile finishing touch for both savory and sweet dishes.",
    "ingredients": "Ingredients: Raw lemon honey, lemon extract, black pepper."
  },
  {
    "id": 8,
    "title": "Triple Chili Honey Drizzle",
    "category": "Honeys",
    "image": "MS-Honey-Triple-Chili-1.webp",
    "description": "Martha Stewart Triple Chili Honey Drizzle combines raw honey with jalapeño, habanero and cayenne peppers for a delicious balance of sweetness and heat. Drizzle it over pizza for a sweet and spicy finishing touch, pair it with grilled chicken or pork, or add it to roasted vegetables for an unexpected burst of flavor. It’s an easy way to bring a little heat—and a lot of flavor—to everyday dishes.",
    "ingredients": "Ingredients: Raw honey, jalapeño pepper, habanero pepper, cayenne pepper, apple cider vinegar."
  },
  {
    "id": 9,
    "title": "Margherita with Fresh Mozzarella Pinsa",
    "category": "Frozen Pinsa",
    "image": "Margherita-with-Fresh-Mozarella-Frozen-Pinsa.webp",
    "description": "Martha Stewart Margherita with Fresh Mozzarella Pinsa brings together vine-ripened tomatoes, fresh mozzarella and basil on a hand-stretched, authentic Roman-style crust. Light, airy and crisp, the crust provides the perfect base for the simple, classic combination of rich tomatoes, creamy fresh mozzarella and fragrant basil. Ready in minutes, it's a fresh take on a timeless Margherita.",
    "features": "Featuring: Vine-ripened tomatoes, fresh mozzarella and basil"
  },
  {
    "id": 10,
    "title": "Margherita with Fresh Mozzarella Pizza",
    "category": "Frozen Pizza",
    "image": "Margherita-with-Fresh-Mozzarella-Frozen-Pizza.webp",
    "description": "Martha Stewart Margherita with Fresh Mozzarella Pizza brings together vine-ripened tomatoes, fresh mozzarella and basil on a hand-stretched, stone-baked crust. Simple, classic ingredients come together for a pizzeria-inspired Margherita with a crisp, airy crust and rich tomato flavor. Ready in minutes, it's an effortless way to enjoy a restaurant-quality pizza at home.",
    "features": "Featuring: Vine-ripened tomatoes, fresh mozzarella and basil"
  },
  {
    "id": 11,
    "title": "Roasted Garlic Pizza Sauce (375g)",
    "category": "Pizza Sauce",
    "image": "Martha-Stewart-Pizza-Sauce-Roasted-Garlic-375.webp",
    "description": "Martha Stewart Roasted Garlic Pizza Sauce combines vine-ripened crushed tomatoes with roasted garlic, extra virgin olive oil, oregano, basil and black pepper for a rich, savory flavor. Spread it over pizza dough and pair with mushrooms, onions, mozzarella or your favorite toppings, or use it as a flavorful sauce for pasta and other Italian-inspired dishes. The roasted garlic adds an extra layer of depth to every bite.",
    "ingredients": "Ingredients: Vine-ripened crushed tomatoes, water, roasted garlic, extra-virgin olive oil, sea salt, oregano, basil, black pepper."
  },
  {
    "id": 12,
    "title": "Roasted Garlic Pizza Sauce (680g)",
    "category": "Pizza Sauce",
    "image": "Martha-Stewart-Pizza-Sauce-Roasted-Garlic-680.webp",
    "description": "Martha Stewart Roasted Garlic Pizza Sauce combines vine-ripened crushed tomatoes with roasted garlic, extra virgin olive oil, oregano, basil and black pepper for a rich, savory flavor. Spread it over pizza dough and pair with mushrooms, onions, mozzarella or your favorite toppings, or use it as a flavorful sauce for pasta and other Italian-inspired dishes. The roasted garlic adds an extra layer of depth to every bite.",
    "ingredients": "Ingredients: Vine-ripened crushed tomatoes, water, roasted garlic, extra-virgin olive oil, sea salt, oregano, basil, black pepper."
  },
  {
    "id": 13,
    "title": "Spicy Pizza Sauce (375g)",
    "category": "Pizza Sauce",
    "image": "Martha-Stewart-Pizza-Sauce-Spicy-375.webp",
    "description": "Martha Stewart Spicy Pizza Sauce combines vine-ripened crushed tomatoes, extra virgin olive oil, garlic, oregano and basil with crushed chilies for a flavorful kick of heat. Use it as the base for a spicy pizza topped with Italian sausage, mozzarella and your favorite vegetables, or spoon it over polenta for a quick and flavorful meal. It's an easy way to add bold tomato flavor and a touch of heat to your favorite dishes.",
    "ingredients": "Ingredients: Vine-ripened crushed tomatoes, water, extra-virgin olive oil, chopped garlic, sea salt, crushed chilies, oregano, basil, black pepper."
  },
  {
    "id": 14,
    "title": "Spicy Pizza Sauce (680g)",
    "category": "Pizza Sauce",
    "image": "Martha-Stewart-Pizza-Sauce-Spicy-680.webp",
    "description": "Martha Stewart Spicy Pizza Sauce combines vine-ripened crushed tomatoes, extra virgin olive oil, garlic, oregano and basil with crushed chilies for a flavorful kick of heat. Use it as the base for a spicy pizza topped with Italian sausage, mozzarella and your favorite vegetables, or spoon it over polenta for a quick and flavorful meal. It's an easy way to add bold tomato flavor and a touch of heat to your favorite dishes.",
    "ingredients": "Ingredients: Vine-ripened crushed tomatoes, water, extra-virgin olive oil, chopped garlic, sea salt, crushed chilies, oregano, basil, black pepper."
  },
  {
    "id": 15,
    "title": "Traditional Pizza Sauce (375g)",
    "category": "Pizza Sauce",
    "image": "Martha-Stewart-Pizza-Sauce-traditional-375.webp",
    "description": "Martha Stewart Traditional Pizza Sauce combines vine-ripened crushed tomatoes with extra virgin olive oil, garlic, oregano, basil and black pepper for a classic, well-balanced flavor. Spread it over your favorite pizza dough and top with fresh mozzarella and basil for a simple, delicious pizza, or use it to bring rich tomato flavor to chicken parmesan, baked pasta and other Italian-inspired dishes.",
    "ingredients": "Ingredients: Vine-ripened crushed tomatoes, water, extra-virgin olive oil, chopped garlic, sea salt, oregano, basil, black pepper."
  },
  {
    "id": 16,
    "title": "Traditional Pizza Sauce (680g)",
    "category": "Pizza Sauce",
    "image": "Martha-Stewart-Pizza-Sauce-traditional-680.webp",
    "description": "Martha Stewart Traditional Pizza Sauce combines vine-ripened crushed tomatoes with extra virgin olive oil, garlic, oregano, basil and black pepper for a classic, well-balanced flavor. Spread it over your favorite pizza dough and top with fresh mozzarella and basil for a simple, delicious pizza, or use it to bring rich tomato flavor to chicken parmesan, baked pasta and other Italian-inspired dishes.",
    "ingredients": "Ingredients: Vine-ripened crushed tomatoes, water, extra-virgin olive oil, chopped garlic, sea salt, oregano, basil, black pepper."
  },
  {
    "id": 17,
    "title": "Garden Herb Seasoning",
    "category": "Seasoning",
    "image": "Martha-Stewart-Seasoning-Garden-Herbs.webp",
    "description": "Martha Stewart Garden Herb Seasoning is a bright, savory blend of sea salt, herbs, onion, garlic, black pepper and lemon. Sprinkle it over oven-baked pizza for an easy finishing touch, season roasted vegetables, chicken or potatoes, or mix it with mayonnaise and sour cream for a quick herb dip. Its fresh, versatile flavor makes it an effortless addition to everyday cooking.",
    "ingredients": "Ingredients: Sea salt, herbs (dill weed, parsley, chives), dehydrated vegetables (onion, garlic), black pepper, lemon juice powder, dehydrated lemon peel, natural lemon flavor, citric acid."
  },
  {
    "id": 18,
    "title": "Mediterranean Tomato Seasoning",
    "category": "Seasoning",
    "image": "Martha-Stewart-Seasoning-Mediterranean-Tomato.webp",
    "description": "Martha Stewart Mediterranean Tomato Seasoning combines tomato, red bell pepper, basil, thyme, garlic, onion and black pepper for a savory, herb-forward blend inspired by Mediterranean flavors. Use it as a finishing touch for oven-baked pizza, sprinkle it over roasted vegetables or chicken, or mix it into a simple vinaigrette for fresh mozzarella or bocconcini. It's an easy way to add rich tomato and herb flavor to everyday dishes.",
    "ingredients": "Ingredients: Dehydrated vegetables (tomato, onion, garlic, red bell pepper), sea salt, herbs (basil, thyme), black pepper, olive oil, silicon dioxide (anti-caking agent), natural lemon flavor."
  },
  {
    "id": 19,
    "title": "Sweet Italian Seasoning",
    "category": "Seasoning",
    "image": "Martha-Stewart-Seasoning-Sweet-Italian.webp",
    "description": "Martha Stewart Sweet Italian Seasoning brings together sea salt, garlic, onion, red bell pepper, fennel seed and rosemary for a savory, aromatic blend with a subtle touch of sweetness. Sprinkle it over oven-baked pizza, use it to season pork or chicken, or add it to roasted vegetables and potatoes. Its classic Italian-inspired flavors make it a versatile pantry staple for adding depth to everyday dishes.",
    "ingredients": "Ingredients: Sea salt, dehydrated vegetables (garlic, onion, red bell pepper), fennel seed, rosemary, olive oil."
  },
  {
    "id": 20,
    "title": "Triple Pepper Mix Seasoning",
    "category": "Seasoning",
    "image": "Martha-Stewart-Seasoning-Tripple-Pepper-Mix.webp",
    "description": "Martha Stewart Triple Pepper Mix Seasoning combines sea salt, black pepper, gochugaru chili flakes and chili pepper flakes for a bold blend with a flavorful kick of heat. Use it as a finishing touch for oven-baked pizza, season steak or pork before cooking, or sprinkle it over roasted vegetables and potatoes. The combination of peppers adds warmth and depth without overpowering your favorite dishes.",
    "ingredients": "Ingredients: Sea salt, black pepper, gochugaru chili flakes, chili pepper flakes."
  },
  {
    "id": 21,
    "title": "Neapolitan Style Dough Mix",
    "category": "Pizza Flour",
    "image": "Napolitan-Style-Pizza-Dough-Mix.webp",
    "description": "Martha Stewart Neapolitan Style 00 Pizza Dough Mix is crafted with premium Italian 00 flour to create an authentic Neapolitan-style pizza crust that's light, airy and beautifully crisp. Use it to make classic Margherita pizza or add your favorite toppings for a pizzeria-inspired experience at home. Perfect for high-heat baking, this mix makes it easy to create a tender, flavorful crust with the signature texture of Neapolitan-style pizza.",
    "ingredients": "Made with: Premium Italian 00 flour"
  },
  {
    "id": 22,
    "title": "Neapolitan Style Pizza Dough Balls",
    "category": "Frozen Pizza Dough",
    "image": "Neapolitan-Style-Frozen-Pizza-Dough.webp",
    "description": "Martha Stewart Neapolitan Style Pizza Dough Balls make it easy to create authentic, pizzeria-inspired pizza at home with a light, airy crust and beautifully crisp exterior. Simply thaw, stretch and top with your favorite sauce, cheese and toppings. Perfect for a classic Margherita or your own creation, each ready-to-use dough ball takes the work out of making dough from scratch while delivering delicious homemade results.",
    "features": "2 ready-to-use pizza dough balls"
  },
  {
    "id": 23,
    "title": "New York Style Pizza Dough Balls",
    "category": "Frozen Pizza Dough",
    "image": "New-York-Style-Frozen-Pizza-Dough.webp",
    "description": "Martha Stewart New York Style Pizza Dough Balls make it easy to create classic New York-style pizza at home with a thin, crisp crust and satisfyingly chewy texture. Simply thaw, stretch and add your favorite sauce, cheese and toppings for an effortless homemade pizza night. Each ready-to-use dough ball gives you the foundation for a generously sized, pizzeria-inspired pizza without the time and preparation of making dough from scratch.",
    "features": "2 ready-to-use pizza dough balls"
  },
  {
    "id": 24,
    "title": "New York Style Dough Mix",
    "category": "Pizza Flour",
    "image": "New-York-Style-Pizza-Dough-Mix.webp",
    "description": "Martha Stewart New York Style Pizza Dough Mix is crafted with premium Italian flour to create the thin, crisp yet chewy crust that defines a classic New York-style pizza. Stretch it into a generously sized pizza and top with sauce, mozzarella, pepperoni or your favorite toppings. Designed for making pizzeria-style pizza at home, this mix delivers a flavorful crust that's sturdy enough to hold your toppings while remaining satisfyingly chewy.",
    "ingredients": "Made with: Premium Italian flour"
  },
  {
    "id": 25,
    "title": "Pepperoni and Hot Pickled Peppers Pinsa",
    "category": "Frozen Pinsa",
    "image": "Pepperoni-and-Hot-Pickled-Peppers-Frozen-Pinsa.webp",
    "description": "Martha Stewart Pepperoni and Hot Pickled Peppers Pinsa combines savory pepperoni with tangy hot pickled peppers, mozzarella and Parmesan on a hand-stretched, authentic Roman-style crust. Light and airy with a crisp exterior, the crust complements the richness of the pepperoni and cheese while hot pickled peppers add a bright, spicy kick. It's a bold twist on classic pepperoni, ready to enjoy at home in minutes.",
    "features": "Featuring: Pepperoni, hot pickled peppers, mozzarella and Parmesan"
  },
  {
    "id": 26,
    "title": "Pepperoni and Hot Pickled Peppers Pizza",
    "category": "Frozen Pizza",
    "image": "Pepperoni-and-Hot-Pickled-Peppers-Frozen-Pizza.webp",
    "description": "Martha Stewart Pepperoni and Hot Pickled Peppers Pizza combines savory pepperoni with tangy hot pickled peppers, mozzarella and Parmesan on a hand-stretched, stone-baked crust. Bold, savory and pleasantly spicy, every bite balances rich pepperoni and melted cheese with the bright kick of pickled peppers. It's a flavorful twist on a classic pepperoni pizza, ready to bake and enjoy in minutes.",
    "features": "Featuring: Pepperoni, hot pickled peppers, mozzarella and Parmesan"
  },
  {
    "id": 27,
    "title": "Roasted Garlic Infused Extra Virgin Olive Oil",
    "category": "Infused Oils",
    "image": "Roasted-Garlic-Infused-Extra-Virgin-Olive-Oil.webp",
    "description": "Martha Stewart Roasted Garlic Infused Extra Virgin Olive Oil brings together extra virgin olive oil with the rich, savory flavor of roasted garlic, rosemary, thyme and oregano. Fragrant and versatile, it adds delicious depth to oven-baked pizzas and is equally at home drizzled over vegetables, pasta or crusty bread. Try rubbing it over a whole chicken before roasting for a beautifully golden, flavorful finish.",
    "ingredients": "Ingredients: Extra-virgin olive oil, rosemary, minced garlic, thyme, oregano, natural flavorings (liquid garlic flavor)."
  },
  {
    "id": 28,
    "title": "Sausage and Hot Honey Pinsa",
    "category": "Frozen Pinsa",
    "image": "Sausage-and-Hot-Honey-Frozen-Pinsa.webp",
    "description": "Martha Stewart Sausage and Hot Honey Pinsa combines savory Italian sausage and fresh mozzarella with hot honey on a hand-stretched, authentic Roman-style crust. The light, airy and crisp crust pairs beautifully with rich Italian sausage, creamy mozzarella and a sweet kick of heat from the hot honey. It's a bold balance of sweet and savory flavors, ready to bake and enjoy in minutes.",
    "features": "Featuring: Fresh mozzarella, Italian sausage and hot honey"
  },
  {
    "id": 29,
    "title": "Sausage and Hot Honey Pizza",
    "category": "Frozen Pizza",
    "image": "Sausage-and-Hot-Honey-Frozen-Pizza.webp",
    "description": "Martha Stewart Sausage and Hot Honey Pizza pairs savory Italian sausage and fresh mozzarella with a drizzle of hot honey on a hand-stretched, stone-baked crust. The combination of savory sausage, creamy cheese and sweet heat creates a bold balance of flavors in every bite. Simply bake until golden for a distinctive, pizzeria-inspired pizza that's ready to enjoy at home in minutes.",
    "features": "Featuring: Fresh mozzarella, Italian sausage and hot honey"
  },
  {
    "id": 30,
    "title": "Spicy Garlic Infused Extra Virgin Olive Oil",
    "category": "Infused Oils",
    "image": "Spicy-Garlic-Infused-Extra-Virgin-Olive-Oil.webp",
    "description": "Martha Stewart Spicy Garlic Infused Extra Virgin Olive Oil pairs extra virgin olive oil with garlic and crushed red pepper for a bold, savory flavor with just the right amount of heat. Drizzle it over oven-baked pizza for an instant upgrade, use it to finish pasta and roasted vegetables, or serve it with warm bread for dipping. For a simple appetizer, try it over warmed olives finished with fresh orange zest.",
    "ingredients": "Ingredients: Extra-virgin olive oil, crushed red pepper, dehydrated garlic, natural flavors (liquid garlic flavor)."
  },
  {
    "id": 31,
    "title": "Spinach Four Cheese With Alfredo Sauce Pinsa",
    "category": "Frozen Pinsa",
    "image": "Spinach-Four-Cheese-With-Alfredo-Frozen-Pinsa.webp",
    "description": "Martha Stewart Spinach Four Cheese with Alfredo Sauce Pinsa combines spinach with creamy Alfredo sauce and a rich blend of fontina, mozzarella, Parmesan and Romano cheeses on a hand-stretched, authentic Roman-style crust. The light, airy and crisp crust balances the creamy sauce and savory blend of cheeses, while spinach adds freshness to every bite. Rich and satisfying, it's an elevated Roman-inspired option that's ready to enjoy at home in minutes.",
    "features": "Featuring: Spinach, Alfredo sauce, fontina, mozzarella, Parmesan and Romano cheeses"
  },
  {
    "id": 32,
    "title": "Spinach Four Cheese with Alfredo Pizza",
    "category": "Frozen Pizza",
    "image": "Spinach-Four-Cheese-with-ALfredo-Frozen-Pizza.webp",
    "description": "Martha Stewart Spinach Four Cheese with Alfredo Pizza combines spinach with creamy Alfredo sauce and a rich blend of fontina, mozzarella, Parmesan and Romano cheeses on a hand-stretched, stone-baked crust. Rich and satisfying, it's an elevated option that's ready to enjoy at home in minutes.",
    "features": "Featuring: Spinach, Alfredo sauce, fontina, mozzarella, Parmesan and Romano cheeses"
  },
  {
    "id": 35,
    "title": "Pizza Dough Balls (Bulk)",
    "category": "Frozen Pizza Dough",
    "image": "Turpone_Pizza_Dough_Balls_2.webp",
    "description": "Premium quality dough balls for food service and retail.",
    "features": ""
  }
];