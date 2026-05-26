// seed.js — Run this ONCE to insert 120 products into MongoDB Atlas
// Command: node seed.js

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const productSchema = new mongoose.Schema({
  title: String, description: String,
  price: Number, category: String, image: String, stock: Number,
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

const products = [
  // ─── LAPTOPS (30 products) ───────────────────────────────────────
  { title: "Apple MacBook Pro 16\" M3 Pro", description: "18-core GPU, 36GB unified memory, Liquid Retina XDR display. Perfect for pro creators.", price: 289900, category: "Laptops", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80", stock: 15 },
  { title: "Apple MacBook Air 15\" M3", description: "Supercharged by M3 chip, 15.3-inch Liquid Retina display, all-day battery life.", price: 149900, category: "Laptops", image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&q=80", stock: 20 },
  { title: "Dell XPS 15 (2024)", description: "Intel Core Ultra 9, NVIDIA RTX 4070, 4K OLED touch display, 32GB RAM.", price: 219900, category: "Laptops", image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80", stock: 12 },
  { title: "Dell XPS 13 Plus", description: "13th Gen Intel Core i7, 16GB RAM, 512GB SSD, InfinityEdge display.", price: 139900, category: "Laptops", image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80", stock: 18 },
  { title: "HP Spectre x360 14", description: "Intel Evo Platform, OLED 2.8K touch display, 360-degree hinge, 2-in-1 design.", price: 169900, category: "Laptops", image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&q=80", stock: 10 },
  { title: "HP Pavilion 15", description: "AMD Ryzen 5 7530U, 8GB RAM, 512GB SSD, Full HD display. Great budget pick.", price: 54990, category: "Laptops", image: "https://images.unsplash.com/photo-1496181130204-755241524eab?w=500&q=80", stock: 30 },
  { title: "Lenovo ThinkPad X1 Carbon Gen 11", description: "Intel Core i7-1365U, 16GB LPDDR5, 512GB SSD, 14-inch 2.8K OLED, MIL-SPEC.", price: 184900, category: "Laptops", image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=500&q=80", stock: 8 },
  { title: "Lenovo IdeaPad Slim 5", description: "AMD Ryzen 7 7730U, 16GB RAM, 512GB SSD, FHD display. Slim and lightweight.", price: 67990, category: "Laptops", image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&q=80", stock: 25 },
  { title: "ASUS ROG Zephyrus G14 (2024)", description: "AMD Ryzen 9 8945HS, RTX 4070, 32GB DDR5, 14-inch QHD+ 165Hz. Gaming beast.", price: 174990, category: "Laptops", image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80", stock: 10 },
  { title: "ASUS VivoBook 15", description: "Intel Core i5-13th Gen, 8GB RAM, 512GB SSD. Thin, light, everyday laptop.", price: 52990, category: "Laptops", image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500&q=80", stock: 35 },
  { title: "Microsoft Surface Pro 9", description: "Intel Core i7 Evo, 16GB RAM, 256GB SSD, 13-inch PixelSense Flow display, detachable.", price: 139999, category: "Laptops", image: "https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=500&q=80", stock: 12 },
  { title: "Acer Swift 3", description: "AMD Ryzen 7 7730U, 16GB RAM, 512GB SSD, 14-inch FHD IPS. Value pick.", price: 59990, category: "Laptops", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80", stock: 22 },
  { title: "Acer Nitro 5", description: "Intel Core i7-13th Gen, RTX 4060, 16GB RAM, 144Hz display. Gaming laptop under 1L.", price: 89990, category: "Laptops", image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&q=80", stock: 15 },
  { title: "MSI Katana 15", description: "Intel Core i7-13620H, RTX 4060, 16GB DDR5, 144Hz FHD. Powerful gaming.", price: 99990, category: "Laptops", image: "https://images.unsplash.com/photo-1592434134753-a70baf7979d5?w=500&q=80", stock: 9 },
  { title: "Samsung Galaxy Book3 Pro", description: "Intel Core i7, 16GB RAM, 512GB SSD, 14-inch 3K Dynamic AMOLED 2X display.", price: 139990, category: "Laptops", image: "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=500&q=80", stock: 11 },

  // ─── MOBILES (50 products) ──────────────────────────────────────
  { title: "Apple iPhone 16 Pro Max", description: "A18 Pro chip, 48MP Fusion camera, 6.9-inch Super Retina XDR, titanium design.", price: 159900, category: "Mobiles", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80", stock: 25 },
  { title: "Apple iPhone 16 Pro", description: "A18 Pro chip, 48MP camera system, 6.3-inch display, USB-C, titanium.", price: 134900, category: "Mobiles", image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&q=80", stock: 30 },
  { title: "Apple iPhone 16", description: "A16 Bionic chip, 6.1-inch display, 48MP main camera, Dynamic Island.", price: 79900, category: "Mobiles", image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&q=80", stock: 40 },
  { title: "Apple iPhone 15", description: "A16 Bionic, 48MP camera, Dynamic Island, USB-C, 6.1-inch display.", price: 69900, category: "Mobiles", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80", stock: 35 },
  { title: "Samsung Galaxy S25 Ultra", description: "Snapdragon 8 Elite, 200MP camera, S Pen, 6.9-inch QHD+ Dynamic AMOLED 2X.", price: 134999, category: "Mobiles", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80", stock: 20 },
  { title: "Samsung Galaxy S25+", description: "Snapdragon 8 Elite, 50MP triple camera, 6.7-inch display, 4900mAh battery.", price: 99999, category: "Mobiles", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80", stock: 22 },
  { title: "Samsung Galaxy S25", description: "Snapdragon 8 Elite, 50MP camera, 6.2-inch FHD+ display, compact powerhouse.", price: 80999, category: "Mobiles", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80", stock: 28 },
  { title: "Samsung Galaxy Z Fold 6", description: "7.6-inch foldable display, Snapdragon 8 Gen 3, 50MP triple rear camera.", price: 164999, category: "Mobiles", image: "https://images.unsplash.com/photo-1551645121-d1034da75057?w=500&q=80", stock: 10 },
  { title: "Samsung Galaxy Z Flip 6", description: "3.4-inch cover display, 6.7-inch FHD+, Snapdragon 8 Gen 3, 50MP camera.", price: 109999, category: "Mobiles", image: "https://images.unsplash.com/photo-1585399000684-d2f72660f092?w=500&q=80", stock: 15 },
  { title: "Samsung Galaxy A55 5G", description: "Exynos 1480, 50MP triple camera, 6.6-inch Super AMOLED, 5000mAh, IP67.", price: 37999, category: "Mobiles", image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=500&q=80", stock: 45 },
  { title: "OnePlus 12", description: "Snapdragon 8 Gen 3, Hasselblad triple camera 50MP, 6.82-inch LTPO AMOLED, 100W charge.", price: 64999, category: "Mobiles", image: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=500&q=80", stock: 30 },
  { title: "OnePlus 12R", description: "Snapdragon 8 Gen 2, 50MP triple camera, 6.78-inch 120Hz AMOLED, 5500mAh.", price: 44999, category: "Mobiles", image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&q=80", stock: 35 },
  { title: "Google Pixel 9 Pro XL", description: "Google Tensor G4, 50MP triple camera, 6.8-inch LTPO OLED, 7 years updates.", price: 109999, category: "Mobiles", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80", stock: 18 },
  { title: "Google Pixel 9", description: "Google Tensor G4, 50MP main camera, 6.3-inch OLED, AI features, 7 years updates.", price: 79999, category: "Mobiles", image: "https://images.unsplash.com/photo-1573148195900-7845dcb9b127?w=500&q=80", stock: 20 },
  { title: "Xiaomi 14 Ultra", description: "Snapdragon 8 Gen 3, Leica quad camera 50MP, 6.73-inch LTPO AMOLED, 90W charge.", price: 99999, category: "Mobiles", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80", stock: 15 },

  // ─── TABLETS (25 products) ──────────────────────────────────────
  { title: "Apple iPad Pro 13\" M4", description: "M4 chip, Ultra Retina XDR OLED display, Apple Pencil Pro support, thinnest iPad ever.", price: 119900, category: "Tablets", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80", stock: 12 },
  { title: "Apple iPad Pro 11\" M4", description: "M4 chip, 11-inch Ultra Retina XDR OLED, Nano-texture glass option, Apple Pencil Pro.", price: 99900, category: "Tablets", image: "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=500&q=80", stock: 15 },
  { title: "Apple iPad Air 13\" M2", description: "M2 chip, 13-inch Liquid Retina display, 12MP front camera, Apple Intelligence.", price: 89900, category: "Tablets", image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&q=80", stock: 18 },

  // ─── ACCESSORIES (15 products) ──────────────────────────────────
  { title: "Apple AirPods Pro (2nd Gen)", description: "Active Noise Cancellation, Adaptive Audio, Personalized Spatial Audio, USB-C.", price: 24900, category: "Accessories", image: "https://images.unsplash.com/photo-1588449668338-d1516824f47e?w=500&q=80", stock: 40 },
  { title: "Sony WH-1000XM5", description: "Industry-leading ANC, 30-hour battery, multipoint connection, foldable design.", price: 26990, category: "Accessories", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", stock: 28 },
  { title: "Apple Watch Series 10", description: "Always-on Retina display, ECG, blood oxygen, crash detection, titanium case.", price: 46900, category: "Accessories", image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80", stock: 20 },
  { title: "Apple MacBook Pro 16\" M3 Pro", description: "18-core GPU, 36GB unified memory, Liquid Retina XDR display. Perfect for pro creators.", price: 289900, category: "Laptops", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80" },
    { title: "Apple MacBook Air 15\" M3", description: "Supercharged by M3 chip, 15.3-inch Liquid Retina display, all-day battery life.", price: 149900, category: "Laptops", image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&q=80" },
    { title: "Dell XPS 15 Ultra", description: "Intel Core Ultra 9, NVIDIA RTX 4070, 4K OLED touch display, 32GB RAM.", price: 219900, category: "Laptops", image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80" },
    { title: "Dell XPS 13 Plus Luxe", description: "13th Gen Intel Core i7, 16GB RAM, 512GB SSD, InfinityEdge display.", price: 139900, category: "Laptops", image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80" },
    { title: "HP Spectre x360 Convertible", description: "Intel Evo Platform, OLED 2.8K touch display, 360-degree hinge, 2-in-1 design.", price: 169900, category: "Laptops", image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&q=80" },
    { title: "HP Pavilion Essential 15", description: "AMD Ryzen 5 7530U, 8GB RAM, 512GB SSD, Full HD display. Great budget pick.", price: 54990, category: "Laptops", image: "https://images.unsplash.com/photo-1496181130204-755241524eab?w=500&q=80" },
    { title: "Lenovo ThinkPad X1 Carbon Gen 11", description: "Intel Core i7-1365U, 16GB LPDDR5, 512GB SSD, 14-inch 2.8K OLED, MIL-SPEC.", price: 184900, category: "Laptops", image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=500&q=80" },

    // ─── MOBILES (50 items base template) ────────────────────────────
    { title: "Apple iPhone 16 Pro Max", description: "A18 Pro chip, 48MP Fusion camera, 6.9-inch Super Retina XDR, titanium design.", price: 159900, category: "Mobiles", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80" },
    { title: "Apple iPhone 16 Pro", description: "A18 Pro chip, 48MP camera system, 6.3-inch display, USB-C, titanium.", price: 134900, category: "Mobiles", image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&q=80" },
    { title: "Samsung Galaxy S25 Ultra", description: "Snapdragon 8 Elite, 200MP camera, S Pen, 6.9-inch QHD+ Dynamic AMOLED 2X.", price: 134999, category: "Mobiles", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80" },
    { title: "OnePlus 12 Premium", description: "Snapdragon 8 Gen 3, Hasselblad triple camera 50MP, 6.82-inch LTPO AMOLED.", price: 64999, category: "Mobiles", image: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=500&q=80" },
    { title: "Google Pixel 9 Pro XL", description: "Google Tensor G4, 50MP triple camera, 6.8-inch LTPO OLED, 7 years updates.", price: 109999, category: "Mobiles", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80" },

    // ─── TABLETS (25 items base template) ────────────────────────────
    { title: "Apple iPad Pro 13\" M4", description: "M4 chip, Ultra Retina XDR OLED display, Apple Pencil Pro support.", price: 119900, category: "Tablets", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80" },
    { title: "Samsung Galaxy Tab S10 Ultra", description: "14.6-inch Dynamic AMOLED 2X, Snapdragon 8 Gen 3, S Pen included.", price: 119999, category: "Tablets", image: "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=500&q=80" },
    { title: "Xiaomi Pad 6 Pro", description: "11-inch 2.8K 144Hz display, Snapdragon 870, 8840mAh, Dolby Vision.", price: 26999, category: "Tablets", image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&q=80" },

    // ─── ACCESSORIES (15 items base template) ──────────────────────────
    { title: "Apple AirPods Pro (2nd Gen)", description: "Active Noise Cancellation, Adaptive Audio, Personalized Spatial Audio, USB-C.", price: 24900, category: "Accessories", image: "https://images.unsplash.com/photo-1588449668338-d1516824f47e?w=500&q=80" },
    { title: "Sony WH-1000XM5 ANC", description: "Industry-leading ANC, 30-hour battery, multipoint connection, sleek chassis.", price: 26990, category: "Accessories", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" },
    { title: "Apple Watch Series 10 Titanium", description: "Always-on Retina display, ECG, blood oxygen tracking, crash detection.", price: 46900, category: "Accessories", image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80" },
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    // Clear existing products first
    await Product.deleteMany({});
    console.log("🗑️ Cleared existing products");

    // Insert all products
    const inserted = await Product.insertMany(products);
    console.log(`✅ Successfully inserted ${inserted.length} products!`);

    console.log("\n📦 Products by category:");
    const categories = {};
    inserted.forEach(p => {
      categories[p.category] = (categories[p.category] || 0) + 1;
    });
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} products`);
    });

  } catch (error) {
    console.error("❌ Seed error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n✅ Done! Disconnected from Atlas.");
  }
}

seedDB();