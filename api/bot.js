console.log("DEBUG: Bot file execution started at top of file!")
import TelegramBot from "node-telegram-bot-api"
import express from "express"
import fs from "fs"
import { createClient } from "@supabase/supabase-js"

console.log("DEBUG: Imports completed.")

const token = process.env.TELEGRAM_BOT_TOKEN
const app = express()
const port = process.env.PORT || 3000

console.log("DEBUG: Variables initialized. Token present:", !!token)

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY
let supabase = null

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey)
  console.log("DEBUG: Supabase client initialized")
} else {
  console.log("DEBUG: Supabase not configured, using JSON file storage")
}

const bot = new TelegramBot(token)
app.use(express.json())

// Обробка webhook запитів
app.post(`/api/webhook`, (req, res) => {
  console.log("Received webhook request on /api/webhook!")
  bot.processUpdate(req.body)
  res.sendStatus(200)
})

// Здоров'я сервісу
app.get("/", (req, res) => {
  console.log("Received root path request on /!")
  res.send("Telegram Bot is running!")
})

// --- База даних товарів ---
const headphones = {
  soundcore_p30i: {
    name: "Soundcore P30i",
    price: 79,
    colors: ["black", "pink"],
    images: [
      "https://yavcvvg6p1ggellz.public.blob.vercel-storage.com/soundcore_p30i_1-kcAQMNT5a6kIIQqY5lXtnDaAGavQKG.jpg",
      "https://yavcvvg6p1ggellz.public.blob.vercel-storage.com/soundcore_p30i_2-bX79umkTtrq2yo62ahrKvp6mGa4tKQE.jpg",
      "https://yavcvvg6p1ggellz.public.blob.vercel-storage.com/soundcore_p30i_3-GtcmrCnmgHnmgHnmgHnmgHnmgHnmgHn.jpg",
    ],
    description: "Оригінал / Нові / Упаковка відкрита / Гарантій немає",
  },
  soundcore_liberty_4: {
    name: "Soundcore Liberty 4",
    price: 129,
    colors: ["black"],
    images: ["/placeholder.svg?height=300&width=300&text=Soundcore+Liberty+4"],
    description: "Оригінал / Нові / Упаковка відкрита / Гарантій немає",
  },
  soundcore_liberty_3_pro: {
    name: "Soundcore Liberty 3 Pro",
    price: 99,
    colors: ["black", "white"],
    images: ["/placeholder.svg?height=300&width=300&text=Soundcore+Liberty+3+Pro"],
    description: "Оригінал / Нові / Упаковка відкрита / Гарантій немає",
  },
  soundcore_space_a40: {
    name: "Soundcore Space A40",
    price: 119,
    colors: ["black", "white", "dark_blue"],
    images: [
      "https://yavcvvg6p1ggellz.public.blob.vercel-storage.com/soundcore_space_a40_1-0ycNJVnpudGC0pzMCuPcNET7BooknJ.jpg",
      "https://yavcvvg6p1ggellz.public.blob.vercel-storage.com/soundcore_space_a40_2-GtcmrCnmgHnmgHnmgHnmgHnmgHnmgHn.jpg",
      "https://yavcvvg6p1ggellz.public.blob.vercel-storage.com/soundcore_space_a40_3-ZZCyKaBJnCG5UMcAmgCYCVDv2Q85df.jpg",
    ],
    description: "Оригінал / Нові / Упаковка відкрита / Гарантій немає",
  },
  soundcore_aerofit: {
    name: "Soundcore AeroFit",
    price: 139,
    colors: ["black", "pink"],
    images: ["/placeholder.svg?height=300&width=300&text=Soundcore+AeroFit"],
    description: "Оригінал / Нові / Упаковка відкрита / Гарантій немає",
  },
  soundcore_a20_sleep: {
    name: "Soundcore A20 Sleep",
    price: 149,
    colors: ["white"],
    images: ["/placeholder.svg?height=300&width=300&text=Soundcore+A20+Sleep"],
    description: "Оригінал / Нові / Упаковка відкрита / Гарантій немає",
  },
  soundcore_tune: {
    name: "Soundcore TUNE",
    price: 59,
    colors: ["black"],
    images: [
      "https://yavcvvg6p1ggellz.public.blob.vercel-storage.com/soundcore_tune_1-BTUMYLg6oThnZ59AM95MYGqbJJy.jpg",
      "https://yavcvvg6p1ggellz.public.blob.vercel-storage.com/soundcore_tune_2-1ZrRnQAg5sT64F3FqTDMgbSX3QJA.jpg",
      "https://yavcvvg6p1ggellz.public.blob.vercel-storage.com/soundcore_tune_3-1fVKxDM9Zy4vMuAYXfMUbf69etuMJI.jpg",
    ],
    description: "Оригінал / Нові / Упаковка відкрита / Гарантій немає",
  },
  soundcore_q21i_nc: {
    name: "Soundcore Q21i NC",
    price: 69,
    colors: ["black"],
    images: ["/placeholder.svg?height=300&width=300&text=Soundcore+Q21i+NC"],
    description: "Оригінал / Нові / Упаковка відкрита / Гарантій немає",
  },
  soundcore_space_one: {
    name: "Soundcore Space One",
    price: 109,
    colors: ["black", "light_blue"],
    images: [
      "https://yavcvvg6p1ggellz.public.blob.vercel-storage.com/soundcore_space_one_1-6HESgBFnIJjuCk3MXm4vXJtOXCUla.jpg",
    ],
    description: "Оригінал / Нові / Упаковка відкрита / Гарантій немає",
  },
  soundcore_space_one_pro: {
    name: "Soundcore Space One Pro",
    price: 159,
    colors: ["black", "cream"],
    images: [
      "https://yavcvvg6p1ggellz.public.blob.vercel-storage.com/soundcore_space_one_pro_1-WD5PCgRcABN3aVMG81XKXummsCM8.jpg",
      "https://yavcvvg6p1ggellz.public.blob.vercel-storage.com/soundcore_space_one_pro_2-Am35GdJb2u1xDJJdCRPRxpdfaP16.jpg",
      "https://yavcvvg6p1ggellz.public.blob.vercel-storage.com/soundcore_space_one_pro_3-IoIKdP9VzZdZKwIAeY9dnuEeofouoa.jpg",
    ],
    description: "Оригінал / Нові / Коробка відкрита / Гарантій немає",
  },
  soundcore_liberty_4_pro: {
    name: "Soundcore Liberty 4 Pro",
    price: 179,
    colors: ["black"],
    images: ["/placeholder.svg?height=300&width=300&text=Soundcore+Liberty+4+Pro"],
    description: "Оригінал / Нові / Коробка відкрита / Гарантій немає",
  },
  soundcore_liberty_4_nc: {
    name: "Soundcore Liberty 4 NC",
    price: 139,
    colors: ["black", "white", "blue"],
    images: ["/placeholder.svg?height=300&width=300&text=Soundcore+Liberty+4+NC"],
    description: "Оригінал / Нові / Коробка відкрита / Гарантій немає",
  },
  soundcore_aerofit_pro: {
    name: "Soundcore AeroFit Pro",
    price: 189,
    colors: ["black", "blue"],
    images: ["/placeholder.svg?height=300&width=300&text=Soundcore+AeroFit+Pro"],
    description: "Оригінал / Нові / Коробка відкрита / Гарантій немає",
  },
}

// Кольори з емодзі
const colorEmojis = {
  white: "⚪ Білий",
  black: "⚫ Чорний",
  silver: "🔘 Сріблястий",
  blue: "🔵 Синій",
  red: "🔴 Червоний",
  pink: "🌸 Рожевий",
  dark_blue: "💙 Темно-синій",
  light_blue: "💧 Світло-блакитний",
  cream: "🍦 Кремовий",
}
// ...existing code...

// --- Стан для адмін-редагування ---
const adminStates = new Map();

// --- Покрокова зміна статусу замовлення ---
bot.onText(/\/setstatus/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  if (!isAdmin(userId)) {
    await bot.sendMessage(chatId, "❌ У вас немає доступу до цієї команди.");
    return;
  }
  const orders = loadOrders();
  if (!orders.length) {
    await bot.sendMessage(chatId, "Замовлень немає.");
    return;
  }
  // Вибір замовлення
  const keyboard = orders.slice(-10).map(order => [
    { text: `#${order.id} (${order.customerData.fullName})`, callback_data: `admin_status_${order.id}` }
  ]);
  await bot.sendMessage(chatId, "Оберіть замовлення для зміни статусу:", {
    reply_markup: { inline_keyboard: keyboard }
  });
  adminStates.set(chatId, { step: "awaiting_status_order" });
});

// --- Покрокове додавання/редагування товару ---
bot.onText(/\/editproducts/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  if (!isAdmin(userId)) {
    await bot.sendMessage(chatId, "❌ У вас немає доступу до цієї команди.");
    return;
  }
  const keyboard = Object.keys(headphones).map(id => [
    { text: headphones[id].name, callback_data: `admin_edit_${id}` }
  ]);
  keyboard.push([{ text: "➕ Додати новий товар", callback_data: "admin_add_product" }]);
  await bot.sendMessage(chatId, "Оберіть товар для редагування:", {
    reply_markup: { inline_keyboard: keyboard }
  });
  adminStates.set(chatId, { step: "edit_select" });
});

// --- Обробка callback_query для адмін-редагування ---
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const data = query.data;

  // --- Зміна статусу замовлення ---
  if (data.startsWith("admin_status_")) {
    if (!isAdmin(userId)) return;
    const orderId = data.replace("admin_status_", "");
    adminStates.set(chatId, { step: "awaiting_new_status", orderId });
    await bot.sendMessage(chatId, "Введіть новий статус для замовлення:");
    await bot.answerCallbackQuery(query.id);
    return;
  }

  // --- Редагування товару ---
  if (data.startsWith("admin_edit_")) {
    if (!isAdmin(userId)) return;
    const productId = data.replace("admin_edit_", "");
    adminStates.set(chatId, { step: "edit_menu", productId });
    await bot.sendMessage(chatId, "Що бажаєте змінити?", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Змінити ціну", callback_data: `admin_edit_price_${productId}` }],
          [{ text: "Змінити опис", callback_data: `admin_edit_desc_${productId}` }],
          [{ text: "Видалити товар", callback_data: `admin_del_${productId}` }]
        ]
      }
    });
    await bot.answerCallbackQuery(query.id);
    return;
  }
  if (data.startsWith("admin_edit_price_")) {
    const productId = data.replace("admin_edit_price_", "");
    adminStates.set(chatId, { step: "awaiting_new_price", productId });
    await bot.sendMessage(chatId, "Введіть нову ціну:");
    await bot.answerCallbackQuery(query.id);
    return;
  }
  if (data.startsWith("admin_edit_desc_")) {
    const productId = data.replace("admin_edit_desc_", "");
    adminStates.set(chatId, { step: "awaiting_new_desc", productId });
    await bot.sendMessage(chatId, "Введіть новий опис:");
    await bot.answerCallbackQuery(query.id);
    return;
  }
  if (data.startsWith("admin_del_")) {
    const productId = data.replace("admin_del_", "");
    if (headphones[productId]) {
      delete headphones[productId];
      await bot.sendMessage(chatId, "✅ Товар видалено.");
    } else {
      await bot.sendMessage(chatId, "❌ Товар не знайдено.");
    }
    await bot.answerCallbackQuery(query.id);
    return;
  }
  if (data === "admin_add_product") {
    adminStates.set(chatId, { step: "awaiting_new_product_id" });
    await bot.sendMessage(chatId, "Введіть ID нового товару (латиницею):");
    await bot.answerCallbackQuery(query.id);
    return;
  }
});

// --- Обробка текстових відповідей для адмін-станів ---
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text;
  if (!isAdmin(userId)) return;

  const state = adminStates.get(chatId);
  if (!state) return;

  // Зміна статусу замовлення
  if (state.step === "awaiting_new_status") {
    const orders = loadOrders();
    const order = orders.find(o => String(o.id) === String(state.orderId));
    if (!order) {
      await bot.sendMessage(chatId, "❌ Замовлення не знайдено.");
    } else {
      order.status = text;
      saveOrders(orders);
      await bot.sendMessage(chatId, `✅ Статус замовлення #${order.id} змінено на "${text}".`);
    }
    adminStates.delete(chatId);
    return;
  }

  // Додавання нового товару
  if (state.step === "awaiting_new_product_id") {
    if (headphones[text]) {
      await bot.sendMessage(chatId, "❌ Товар з таким ID вже існує. Введіть інший ID:");
      return;
    }
    state.newProduct = { id: text };
    state.step = "awaiting_new_product_name";
    adminStates.set(chatId, state);
    await bot.sendMessage(chatId, "Введіть назву товару:");
    return;
  }
  if (state.step === "awaiting_new_product_name") {
    state.newProduct.name = text;
    state.step = "awaiting_new_product_price";
    adminStates.set(chatId, state);
    await bot.sendMessage(chatId, "Введіть ціну товару:");
    return;
  }
  if (state.step === "awaiting_new_product_price") {
    const price = Number(text);
    if (isNaN(price)) {
      await bot.sendMessage(chatId, "❌ Введіть коректну ціну (число):");
      return;
    }
    state.newProduct.price = price;
    state.step = "awaiting_new_product_colors";
    adminStates.set(chatId, state);
    await bot.sendMessage(chatId, "Введіть кольори через кому (наприклад: black,white):");
    return;
  }
  if (state.step === "awaiting_new_product_colors") {
    state.newProduct.colors = text.split(",").map(c => c.trim());
    state.step = "awaiting_new_product_desc";
    adminStates.set(chatId, state);
    await bot.sendMessage(chatId, "Введіть опис товару:");
    return;
  }
  if (state.step === "awaiting_new_product_desc") {
    state.newProduct.description = text;
    state.step = "awaiting_new_product_images";
    adminStates.set(chatId, state);
    await bot.sendMessage(chatId, "Введіть посилання на зображення через кому:");
    return;
  }
  if (state.step === "awaiting_new_product_images") {
    state.newProduct.images = text.split(",").map(u => u.trim());
    const { id, name, price, colors, description, images } = state.newProduct;
    headphones[id] = { name, price, colors, description, images };
    await bot.sendMessage(chatId, `✅ Товар "${name}" додано.`);
    adminStates.delete(chatId);
    return;
  }

  // Зміна ціни
  if (state.step === "awaiting_new_price") {
    const price = Number(text);
    if (isNaN(price)) {
      await bot.sendMessage(chatId, "❌ Введіть коректну ціну (число):");
      return;
    }
    const product = headphones[state.productId];
    if (!product) {
      await bot.sendMessage(chatId, "❌ Товар не знайдено.");
    } else {
      product.price = price;
      await bot.sendMessage(chatId, `✅ Ціну для "${product.name}" змінено на $${price}.`);
    }
    adminStates.delete(chatId);
    return;
  }
  // Зміна опису
  if (state.step === "awaiting_new_desc") {
    const product = headphones[state.productId];
    if (!product) {
      await bot.sendMessage(chatId, "❌ Товар не знайдено.");
    } else {
      product.description = text;
      await bot.sendMessage(chatId, `✅ Опис для "${product.name}" змінено.`);
    }
    adminStates.delete(chatId);
    return;
  }
});

// --- ВИДАЛІТЬ старі адмін-команди нижче (setstatus, addproduct, delproduct, setprice) ---
// ...видаліть блоки з bot.onText(/\/setstatus ...), bot.onText(/\/addproduct ...), bot.onText(/\/delproduct ...), bot.onText(/\/setprice ...)
// --- КІНЕЦЬ ВИДАЛЕННЯ ---

// ...existing code...

// Зберігання кошиків користувачів (в пам'яті, дані втрачаються при перезапуску)
const userCarts = new Map()

// Зберігання станів користувачів для процесу замовлення
const userStates = new Map()

const ORDERS_FILE = "orders.json"

// Функция для загрузки заказов из файла
function loadOrders() {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, "utf8")
      return JSON.parse(data)
    }
  } catch (error) {
    console.error("Error loading orders:", error)
  }
  return []
}

// Функция для сохранения заказов в файл
function saveOrders(orders) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2))
  } catch (error) {
    console.error("Error saving orders:", error)
  }
}

async function saveOrderToSupabase(order) {
  if (!supabase) return false

  try {
    const { data, error } = await supabase.from("orders").insert([order]).select()

    if (error) {
      console.error("Error saving order to Supabase:", error)
      return false
    }

    console.log("Order saved to Supabase:", data)
    return true
  } catch (error) {
    console.error("Error saving order to Supabase:", error)
    return false
  }
}


// ===== ДОДАНО: Функції для роботи з Supabase клієнтами =====
async function getCustomerFromSupabase(userId) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", userId)
      .single();
    if (error && error.code !== "PGRST116") { // PGRST116 - no rows found
      console.error("Error fetching customer:", error);
    }
    return data || null;
  } catch (err) {
    console.error("Error in getCustomerFromSupabase:", err);
    return null;
  }
}

async function saveCustomerToSupabase(order) {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("customers").upsert([
      {
        id: order.userId,
        full_name: order.customerData.fullName,
        phone: order.customerData.phone,
        post_office: order.customerData.postOffice,
        city: order.customerData.city,
        username: order.customerData.username,
        created_at: new Date().toISOString()
      }
    ]);
    if (error) {
      console.error("Error saving customer:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error in saveCustomerToSupabase:", err);
    return false;
  }
}

const allOrders = loadOrders()

// ID адміністратора
const ADMIN_ID = process.env.ADMIN_ID || 6486502899

const ORDERS_CHANNEL_ID = process.env.ORDERS_CHANNEL_ID || "-1002534353239"

// --- Обробники команд та callback запитів ---
// Команда /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id
  userStates.delete(chatId)
  const welcomeMessage = `🎧 Ласкаво просимо до магазину навушників Soundcore!

Всі навушники нові, але упаковка відкрита. Гарантій немає.

Оберіть дію:`

  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🛍️ Переглянути каталог", callback_data: "catalog" }],
        [{ text: "🛒 Мій кошик", callback_data: "cart" }],
        [{ text: "⚡ Швидке замовлення", callback_data: "quick_checkout" }],
        [{ text: "ℹ️ Про нас", callback_data: "about" }],
      ],
    },
  }

  try {
    await bot.sendMessage(chatId, welcomeMessage, options)
  } catch (error) {
    console.error("Error sending /start message:", error)
  }
})

// Команда для адміністратора для перегляду замовлень
bot.onText(/\/orders/, async (msg) => {
  const chatId = msg.chat.id
  const userId = msg.from.id

  if (userId !== ADMIN_ID) {
    await bot.sendMessage(chatId, "❌ У вас немає доступу до цієї команди.")
    return
  }

  const orders = loadOrders()

  if (orders.length === 0) {
    await bot.sendMessage(chatId, "📋 Замовлень поки немає.")
    return
  }

  let ordersMessage = `📋 Всі замовлення (${orders.length}):\n\n`
  orders.slice(-10).forEach((order, index) => {
    ordersMessage += `🆔 #${order.id}\n`
    ordersMessage += `👤 ${order.customerData.fullName}\n`
    ordersMessage += `👨‍💻 Username: ${order.customerData.username || "не вказано"}\n`
    ordersMessage += `📞 ${order.customerData.phone}\n`
    ordersMessage += `📧 ${order.customerData.email}\n`
    ordersMessage += `🏠 ${order.customerData.address}, ${order.customerData.city}\n`
    ordersMessage += `💰 Сума: ${order.total > 0 ? `$${order.total}` : "Уточнюйте"}\n`
    ordersMessage += `📅 ${new Date(order.date).toLocaleString("uk-UA")}\n`
    ordersMessage += `📦 Товари:\n`

    if (order.items && Array.isArray(order.items)) {
      order.items.forEach((item, itemIndex) => {
        ordersMessage += `   ${itemIndex + 1}. ${item.name}\n`
        ordersMessage += `      🎨 ${item.colorDisplay}\n`
        ordersMessage += `      💰 ${typeof item.price === "number" ? `$${item.price}` : "Ціну уточнюйте"}\n`
      })
    }
    ordersMessage += `\n`
  })

  try {
    await bot.sendMessage(chatId, ordersMessage)
  } catch (error) {
    console.error("Error sending orders list:", error)
  }
})

// Обробка callback запитів
bot.on("callback_query", async (callbackQuery) => {
  console.log("Callback query handler triggered!")
  const message = callbackQuery.message
  const chatId = message.chat.id
  const data = callbackQuery.data
  const userId = callbackQuery.from.id
  console.log("DEBUG: Answered callback query:", callbackQuery.id)
  console.log("Received callback query data:", data)

  try {
    if (userStates.has(chatId) && data !== "cancel_order") {
      await bot.answerCallbackQuery(callbackQuery.id, {
        text: "Будь ласка, завершіть або скасуйте поточне замовлення.",
      })
      return
    }

    if (data === "catalog") {
      await showCatalog(chatId)
    } else if (data === "cart") {
      await showCart(chatId, userId)
    } else if (data === "about") {
      await showAbout(chatId)
    } else if (data.startsWith("product_")) {
      const productId = data.replace("product_", "")
      await showProduct(chatId, productId, userId)
    } else if (data.startsWith("color_")) {
      const colorPrefix = "color_"
      const withoutPrefix = data.substring(colorPrefix.length)
      const lastUnderscoreIndex = withoutPrefix.lastIndexOf("_")
      const productId = withoutPrefix.substring(0, lastUnderscoreIndex)
      const color = withoutPrefix.substring(lastUnderscoreIndex + 1)
      await selectColor(chatId, userId, productId, color)
    } else if (data.startsWith("add_to_cart_")) {
      const [, , , productId, color] = data.split("_")
      await addToCart(chatId, userId, productId, color)
    } else if (data.startsWith("remove_")) {
      const itemIndex = Number.parseInt(data.replace("remove_", ""))
      await removeFromCart(chatId, userId, itemIndex)
    } else if (data === "checkout") {
      await startCheckout(chatId, userId)
    } else if (data === "quick_checkout") {
      const customer = await getCustomerFromSupabase(userId);
      const cart = userCarts.get(userId) || [];
      if (cart.length === 0) {
        await bot.sendMessage(chatId, "❌ Ваш кошик порожній.");
        return;
      }
      if (!customer) {
        await bot.sendMessage(chatId, "ℹ️ Дані не знайдені. Будь ласка, заповніть замовлення звичайним способом.");
        await startCheckout(chatId, userId);
        return;
      }
      const orderData = {
        fullName: customer.full_name,
        phone: customer.phone,
        postOffice: customer.post_office,
        city: customer.city,
        cart: cart
      };
      await finalizeOrder(chatId, userId, orderData);
} else if (data === "back_to_catalog") {
      await showCatalog(chatId)
    } else if (data === "back_to_main") {
      await showMainMenu(chatId)
    } else if (data === "cancel_order") {
      await cancelOrder(chatId)
    }

    await bot.answerCallbackQuery(callbackQuery.id)
  } catch (error) {
    console.error("Error handling callback:", error)
    await bot.answerCallbackQuery(callbackQuery.id, { text: "Виникла помилка" })
  }
})

// Обробка текстових повідомлень (для збору даних замовлення)
bot.on("message", async (msg) => {
  const chatId = msg.chat.id
  const userId = msg.from.id
  const text = msg.text

  if (text.startsWith("/") && text !== "/start") {
    if (userStates.has(chatId)) {
      await bot.sendMessage(
        chatId,
        "Будь ласка, завершіть або скасуйте поточне замовлення, перш ніж використовувати команди.",
      )
    }
    return
  }

  if (text === "/start") {
    return
  }

  const currentState = userStates.get(chatId)
  if (currentState) {
    try {
      switch (currentState.step) {
        case "awaiting_name":
          currentState.orderData.fullName = text
          currentState.step = "awaiting_phone"
          await bot.sendMessage(chatId, "Введіть ваш номер телефону (наприклад, +380XXXXXXXXX):", {
            reply_markup: {
              inline_keyboard: [[{ text: "❌ Скасувати замовлення", callback_data: "cancel_order" }]],
            },
          })
          break
        case "awaiting_phone":
          if (!/^\+?\d{10,15}$/.test(text)) {
            await bot.sendMessage(chatId, "Будь ласка, введіть коректний номер телефону.")
            return
          }
          currentState.orderData.phone = text
          currentState.step = "awaiting_post_office"
          await bot.sendMessage(chatId, "Введіть номер та назву пошти (наприклад: Нова Пошта №5, вул. Хрещатик 1):", {
            reply_markup: {
              inline_keyboard: [[{ text: "❌ Скасувати замовлення", callback_data: "cancel_order" }]],
            },
          })
          break
        case "awaiting_post_office":
          currentState.orderData.postOffice = text
          currentState.step = "awaiting_city"
          await bot.sendMessage(chatId, "Введіть ваше місто:", {
            reply_markup: {
              inline_keyboard: [[{ text: "❌ Скасувати замовлення", callback_data: "cancel_order" }]],
            },
          })
          break
        case "awaiting_city":
          currentState.orderData.city = text
          userStates.delete(chatId)
          await finalizeOrder(chatId, userId, currentState.orderData)
          break
      }
    } catch (error) {
      console.error("Error processing user input:", error)
      await bot.sendMessage(
        chatId,
        "Виникла помилка при обробці ваших даних. Спробуйте ще раз або скасуйте замовлення.",
      )
    }
  }
})

// Показати головне меню
async function showMainMenu(chatId) {
  const welcomeMessage = `🎧 Ласкаво просимо до магазину навушників Soundcore!

Всі навушники нові, але упаковка відкрита. Гарантій немає.

Оберіть дію:`

  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🛍️ Переглянути каталог", callback_data: "catalog" }],
        [{ text: "🛒 Мій кошик", callback_data: "cart" }],
        [{ text: "⚡ Швидке замовлення", callback_data: "quick_checkout" }],
        [{ text: "ℹ️ Про нас", callback_data: "about" }],
      ],
    },
  }

  try {
    await bot.sendMessage(chatId, welcomeMessage, options)
  } catch (error) {
    console.error("Error sending main menu message:", error)
  }
}

// Показати каталог
async function showCatalog(chatId) {
  const catalogMessage = "🎧 Каталог навушників Soundcore:\n\nОберіть модель для детального перегляду:"

  const keyboard = Object.keys(headphones).map((productId) => [
    {
      text: `${headphones[productId].name} ${typeof headphones[productId].price === "number" ? `- $${headphones[productId].price}` : ""}`,
      callback_data: `product_${productId}`,
    },
  ])

  keyboard.push([{ text: "🏠 Головне меню", callback_data: "back_to_main" }])

  const options = {
    reply_markup: {
      inline_keyboard: keyboard,
    },
  }

  try {
    await bot.sendMessage(chatId, catalogMessage, options)
  } catch (error) {
    console.error("Error sending catalog message:", error)
  }
}

// Показати продукт
async function showProduct(chatId, productId, userId) {
  const product = headphones[productId]
  if (!product) return

  const productMessage = `🎧 ${product.name}

${typeof product.price === "number" ? `💰 Ціна: $${product.price}` : "💰 Ціна: Уточнюйте"}

📝 ${product.description}

🎨 Доступні кольори:`

  const colorKeyboard = product.colors.map((color) => [
    {
      text: colorEmojis[color],
      callback_data: `color_${productId}_${color}`,
    },
  ])

  colorKeyboard.push([{ text: "⬅️ Назад до каталогу", callback_data: "back_to_catalog" }])

  const options = {
    reply_markup: {
      inline_keyboard: colorKeyboard,
    },
  }

  try {
    // Use placeholder image for all products to avoid errors
    const placeholderUrl = `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(product.name)}`
    console.log(`DEBUG: Using placeholder for product ${productId}:`, placeholderUrl)

    await bot.sendPhoto(chatId, placeholderUrl, {
      caption: productMessage,
      reply_markup: options.reply_markup,
    })

    console.log(`DEBUG: Successfully sent placeholder for product ${productId}`)
  } catch (error) {
    console.error(`Error sending product photo for ${productId}:`, error)
    try {
      await bot.sendMessage(chatId, productMessage, options)
    } catch (fallbackError) {
      console.error("Error sending fallback message:", fallbackError)
    }
  }
}

// Вибір кольору - тепер автоматично додає до кошика
async function selectColor(chatId, userId, productId, color) {
  const product = headphones[productId]
  if (!product) return

  if (!userCarts.has(userId)) {
    userCarts.set(userId, [])
  }

  const cart = userCarts.get(userId)
  cart.push({
    productId,
    name: product.name,
    color,
    price: product.price,
  })

  const successMessage = `✅ Товар автоматично додано до кошика!

🎧 ${product.name}
🎨 ${colorEmojis[color]}
${typeof product.price === "number" ? `💰 $${product.price}` : "💰 Ціну уточнюйте"}

Що бажаєте зробити далі?`

  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🛒 Переглянути кошик", callback_data: "cart" }],
        [{ text: "🛍️ Продовжити покупки", callback_data: "catalog" }],
        [{ text: "💳 Оформити замовлення", callback_data: "checkout" }],
      ],
    },
  }

  try {
    await bot.sendMessage(chatId, successMessage, options)
  } catch (error) {
    console.error("Error sending auto add to cart message:", error)
  }
}

// Додати до кошика
async function addToCart(chatId, userId, productId, color) {
  const product = headphones[productId]
  if (!product) return

  if (!userCarts.has(userId)) {
    userCarts.set(userId, [])
  }

  const cart = userCarts.get(userId)
  cart.push({
    productId,
    name: product.name,
    color,
    price: product.price,
  })

  const successMessage = `✅ Товар додано до кошика!

🎧 ${product.name}
🎨 ${colorEmojis[color]}
${typeof product.price === "number" ? `$${product.price}` : "💰 Ціну уточнюйте"}

Що бажаєте зробити далі?`

  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🛒 Переглянути кошик", callback_data: "cart" }],
        [{ text: "🛍️ Продовжити покупки", callback_data: "catalog" }],
        [{ text: "💳 Оформити замовлення", callback_data: "checkout" }],
      ],
    },
  }

  try {
    await bot.sendMessage(chatId, successMessage, options)
  } catch (error) {
    console.error("Error sending add to cart message:", error)
  }
}

// Показати кошик
async function showCart(chatId, userId) {
  const cart = userCarts.get(userId) || []

  if (cart.length === 0) {
    const emptyMessage = "🛒 Ваш кошик порожній\n\nПерейдіть до каталогу для вибору товарів."
    const options = {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🛍️ Перейти до каталогу", callback_data: "catalog" }],
          [{ text: "🏠 Головне меню", callback_data: "back_to_main" }],
        ],
      },
    }

    try {
      await bot.sendMessage(chatId, emptyMessage, options)
    } catch (error) {
      console.error("Error sending empty cart message:", error)
    }
    return
  }

  let cartMessage = "🛒 Ваш кошик:\n\n"
  let total = 0

  cart.forEach((item, index) => {
    cartMessage += `${index + 1}. ${item.name}\n`
    cartMessage += `   🎨 ${colorEmojis[item.color]}\n`
    cartMessage += `   💰 ${typeof item.price === "number" ? `$${item.price}` : "Ціну уточнюйте"}\n\n`

    if (typeof item.price === "number") {
      total += item.price
    }
  })

  cartMessage += `💳 Загальна сума: ${total > 0 ? `$${total}` : "Уточнюйте"}`

  const keyboard = cart.map((item, index) => [{ text: `❌ Видалити ${item.name}`, callback_data: `remove_${index}` }])

  keyboard.push(
    [{ text: "💳 Оформити замовлення", callback_data: "checkout" }],
    [{ text: "⬅️ Назад до каталогу", callback_data: "back_to_catalog" }],
    [{ text: "🛍️ Продовжити покупки", callback_data: "catalog" }],
  )

  const options = {
    reply_markup: {
      inline_keyboard: keyboard,
    },
  }

  try {
    await bot.sendMessage(chatId, cartMessage, options)
  } catch (error) {
    console.error("Error sending cart message:", error)
  }
}

// Видалити з кошика
async function removeFromCart(chatId, userId, itemIndex) {
  const cart = userCarts.get(userId) || []

  if (itemIndex >= 0 && itemIndex < cart.length) {
    const removedItem = cart.splice(itemIndex, 1)[0]
    try {
      await bot.sendMessage(chatId, `✅ ${removedItem.name} видалено з кошика`)
      if (cart.length > 0) {
        await showCart(chatId, userId)
      } else {
        await bot.sendMessage(chatId, "🛒 Ваш кошик тепер порожній", {
          reply_markup: {
            inline_keyboard: [
              [{ text: "🛍️ Перейти до каталогу", callback_data: "catalog" }],
              [{ text: "🏠 Головне меню", callback_data: "back_to_main" }],
            ],
          },
        })
      }
    } catch (error) {
      console.error("Error removing from cart or showing updated cart:", error)
    }
  } else {
    try {
      await bot.sendMessage(chatId, "❌ Помилка: товар не знайдено в кошику")
      await showCart(chatId, userId)
    } catch (error) {
      console.error("Error sending error message:", error)
    }
  }
}

// Початок процесу оформлення замовлення
async function startCheckout(chatId, userId) {
  const cart = userCarts.get(userId) || []

  if (cart.length === 0) {
    try {
      await bot.sendMessage(chatId, "❌ Ваш кошик порожній. Додайте товари, щоб оформити замовлення.")
    } catch (error) {
      console.error("Error sending empty cart message at checkout start:", error)
    }
    return
  }

  userStates.set(chatId, { step: "awaiting_name", orderData: { cart: cart } })

  try {
    await bot.sendMessage(chatId, "Будь ласка, введіть ваше повне ім'я (ПІБ):", {
      reply_markup: {
        inline_keyboard: [[{ text: "❌ Скасувати замовлення", callback_data: "cancel_order" }]],
      },
    })
  } catch (error) {
    console.error("Error starting checkout process:", error)
  }
}

// Скасування замовлення
async function cancelOrder(chatId) {
  userStates.delete(chatId)

  try {
    await bot.sendMessage(
      chatId,
      "✅ Замовлення скасовано. Ви можете продовжити покупки або повернутися до головного меню.",
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "🛍️ Переглянути каталог", callback_data: "catalog" }],
            [{ text: "🏠 Головне меню", callback_data: "back_to_main" }],
          ],
        },
      },
    )
  } catch (error) {
    console.error("Error sending cancel order message:", error)
  }
}

// Показати інформацію про нас
async function showAbout(chatId) {
  const aboutMessage =
    "ℹ️ Про нас:\n\nМи - магазин навушників Soundcore. Всі наші товари нові, але упаковка відкрита. Гарантій немає."

  const options = {
    reply_markup: {
      inline_keyboard: [[{ text: "🏠 Головне меню", callback_data: "back_to_main" }]],
    },
  }

  try {
    await bot.sendMessage(chatId, aboutMessage, options)
  } catch (error) {
    console.error("Error sending about message:", error)
  }
}

// Завершення замовлення після збору всіх данних
async function finalizeOrder(chatId, userId, orderData) {
  let orderSummary = "📋 Ваше замовлення успішно оформлено!\n\n"
  let total = 0
  orderSummary += "--- Товари в кошику ---\n"
  orderData.cart.forEach((item, index) => {
    orderSummary += `${index + 1}. ${item.name}\n`
    orderSummary += `   🎨 ${colorEmojis[item.color]}\n`
    orderSummary += `   💰 ${typeof item.price === "number" ? `$${item.price}` : "Ціну уточнюйте"}\n\n`
    if (typeof item.price === "number") {
      total += item.price
    }
  })

  let username = "не вказано"
  try {
    const chatMember = await bot.getChatMember(chatId, userId)
    username = chatMember.user.username || "не вказано"
  } catch (error) {
    console.log("Could not get username:", error.message)
  }

  orderSummary += `--- Дані покупця ---\n`
  orderSummary += `👤 ПІБ: ${orderData.fullName}\n`
  orderSummary += `👨‍💻 Username: @${username}\n`
  orderSummary += `📞 Телефон: ${orderData.phone}\n`
  orderSummary += `📮 Пошта: ${orderData.postOffice}, ${orderData.city}\n\n`
  orderSummary += `💳 Загальна сума: ${total > 0 ? `$${total}` : "Уточнюйте"}\n\n`

  const orderId = Date.now()
  orderSummary += `🆔 Номер замовлення: #${orderId}\n\n`
  orderSummary += `Дякуємо за ваше замовлення! Ми зв'яжемося з вами найближчим часом.`

  const order = {
    id: orderId,
    userId: userId,
    chatId: chatId,
    date: new Date().toISOString(),
    customerData: {
      fullName: orderData.fullName,
      phone: orderData.phone,
      postOffice: orderData.postOffice,
      city: orderData.city,
      username: username,
    },
    items: orderData.cart.map((item) => ({
      productId: item.productId,
      name: item.name,
      color: item.color,
      colorDisplay: colorEmojis[item.color],
      price: item.price,
    })),
    total: total > 0 ? total : "Уточнюйте",
    status: "новий",
  }

  await saveCustomerToSupabase(order);
  allOrders.push(order)
  saveOrders(allOrders)

  if (supabase) {
    await saveOrderToSupabase(order)
  }

  userCarts.delete(userId)

  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🛍️ Нове замовлення", callback_data: "catalog" }],
        [{ text: "🏠 Головне меню", callback_data: "back_to_main" }],
      ],
    },
  }

  try {
    await bot.sendMessage(chatId, orderSummary, options)

    console.log("DEBUG: Attempting to send to channel:", ORDERS_CHANNEL_ID)
    if (ORDERS_CHANNEL_ID && ORDERS_CHANNEL_ID !== "undefined") {
      const channelMessage = `🔔 НОВЕ ЗАМОВЛЕННЯ #${orderId}\n\n${orderSummary}`
      try {
        await bot.sendMessage(ORDERS_CHANNEL_ID, channelMessage)
        console.log("DEBUG: Successfully sent to channel")
      } catch (channelError) {
        console.error("Error sending channel notification:", channelError)
        console.error("Channel ID used:", ORDERS_CHANNEL_ID)

        // Fallback to admin
        if (ADMIN_ID) {
          try {
            const adminMessage = `🔔 НОВЕ ЗАМОВЛЕННЯ #${orderId}\n\n${orderSummary}`
            await bot.sendMessage(ADMIN_ID, adminMessage)
            console.log("DEBUG: Sent to admin as fallback")
          } catch (adminError) {
            console.error("Error sending admin notification:", adminError)
          }
        }
      }
    } else {
      console.log("DEBUG: No valid channel ID, sending to admin")
      if (ADMIN_ID) {
        try {
          const adminMessage = `🔔 НОВЕ ЗАМОВЛЕННЯ #${orderId}\n\n${orderSummary}`
          await bot.sendMessage(ADMIN_ID, adminMessage)
        } catch (adminError) {
          console.error("Error sending admin notification:", adminError)
        }
      }
    }
  } catch (error) {
    console.error("Error sending final order summary:", error)
  }
}

export default app
