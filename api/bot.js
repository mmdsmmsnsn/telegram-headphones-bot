// Цей лог має з'явитися в логах Vercel, якщо файл взагалі виконується
console.log("DEBUG: Bot file execution started at top of file!")

import TelegramBot from "node-telegram-bot-api"
import express from "express"

console.log("DEBUG: Imports completed.")

const token = process.env.TELEGRAM_BOT_TOKEN
const app = express()
const port = process.env.PORT || 3000

console.log("DEBUG: Variables initialized. Token present:", !!token) // Перевіряємо, чи токен існує

const bot = new TelegramBot(token)

app.use(express.json())

// Обробка webhook запитів.
app.post(`/api/webhook`, (req, res) => {
  console.log("Received webhook request on /api/webhook!") // Лог для кожного вхідного webhook
  bot.processUpdate(req.body)
  res.sendStatus(200)
})

// Здоров'я сервісу.
app.get("/", (req, res) => {
  console.log("Received root path request on /!") // Лог для запитів на кореневий шлях
  res.send("Telegram Bot is running!")
})

// --- База даних товарів ---
const headphones = {
  soundcore_p30i: {
    name: "Soundcore P30i",
    price: 79,
    colors: ["black", "pink"],
    images: [
      // Змінено на масив зображень
      "/images/soundcore_p30i_1.jpg",
      "/images/soundcore_p30i_2.jpg",
      "/images/soundcore_p30i_3.jpg",
    ],
    description: "Оригінал / Нові / Упаковка відкрита / Гарантій немає",
  },
  soundcore_liberty_4: {
    name: "Soundcore Liberty 4",
    price: 129,
    colors: ["black"],
    images: [
      "/images/soundcore_liberty_4_1.jpg",
      "/images/soundcore_liberty_4_2.jpg",
      "/images/soundcore_liberty_4_3.jpg",
    ],
    description: "Оригінал / Нові / Упаковка відкрита / Гарантій немає",
  },
  soundcore_liberty_3_pro: {
    name: "Soundcore Liberty 3 Pro",
    price: 99,
    colors: ["black", "white"],
    images: [
      "/images/soundcore_liberty_3_pro_1.jpg",
      "/images/soundcore_liberty_3_pro_2.jpg",
      "/images/soundcore_liberty_3_pro_3.jpg",
    ],
    description: "Оригінал / Нові / Упаковка відкрита / Гарантій немає",
  },
  soundcore_space_a40: {
    name: "Soundcore Space A40",
    price: 119,
    colors: ["black", "white", "dark_blue"],
    images: [
      "/images/soundcore_space_a40_1.jpg",
      "/images/soundcore_space_a40_2.jpg",
      "/images/soundcore_space_a40_3.jpg",
    ],
    description: "Оригінал / Нові / Упаковка відкрита / Гарантій немає",
  },
  soundcore_aerofit: {
    name: "Soundcore AeroFit",
    price: 139,
    colors: ["black", "pink"],
    images: ["/images/soundcore_aerofit_1.jpg", "/images/soundcore_aerofit_2.jpg", "/images/soundcore_aerofit_3.jpg"],
    description: "Оригінал / Нові / Упаковка відкрита / Гарантій немає",
  },
  soundcore_a20_sleep: {
    name: "Soundcore A20 Sleep",
    price: 149,
    colors: ["white"],
    images: [
      "/images/soundcore_a20_sleep_1.jpg",
      "/images/soundcore_a20_sleep_2.jpg",
      "/images/soundcore_a20_sleep_3.jpg",
    ],
    description: "Оригінал / Нові / Упаковка відкрита / Гарантій немає",
  },
  soundcore_tune: {
    name: "Soundcore TUNE",
    price: 59,
    colors: ["black"],
    images: ["/images/soundcore_tune_1.jpg", "/images/soundcore_tune_2.jpg", "/images/soundcore_tune_3.jpg"],
    description: "Оригінал / Нові / Упаковка відкрита / Гарантій немає",
  },
  soundcore_q21i_nc: {
    name: "Soundcore Q21i NC",
    price: 69,
    colors: ["black"],
    images: ["/images/soundcore_q21i_nc_1.jpg", "/images/soundcore_q21i_nc_2.jpg", "/images/soundcore_q21i_nc_3.jpg"],
    description: "Оригінал / Нові / Упаковка відкрита / Гарантій немає",
  },
  soundcore_space_one: {
    name: "Soundcore Space One",
    price: 109,
    colors: ["black", "light_blue"],
    images: [
      "/images/soundcore_space_one_1.jpg",
      "/images/soundcore_space_one_2.jpg",
      "/images/soundcore_space_one_3.jpg",
    ],
    description: "Оригінал / Нові / Упаковка відкрита / Гарантій немає",
  },
  soundcore_space_one_pro: {
    name: "Soundcore Space One Pro",
    price: 159,
    colors: ["black", "cream"],
    images: [
      "/images/soundcore_space_one_pro_1.jpg",
      "/images/soundcore_space_one_pro_2.jpg",
      "/images/soundcore_space_one_pro_3.jpg",
    ],
    description: "Оригінал / Нові / Коробка відкрита / Гарантій немає",
  },
  soundcore_liberty_4_pro: {
    name: "Soundcore Liberty 4 Pro",
    price: 179,
    colors: ["black"],
    images: [
      "/images/soundcore_liberty_4_pro_1.jpg",
      "/images/soundcore_liberty_4_pro_2.jpg",
      "/images/soundcore_liberty_4_pro_3.jpg",
    ],
    description: "Оригінал / Нові / Коробка відкрита / Гарантій немає",
  },
  soundcore_liberty_4_nc: {
    name: "Soundcore Liberty 4 NC",
    price: 139,
    colors: ["black", "white", "blue"],
    images: [
      "/images/soundcore_liberty_4_nc_1.jpg",
      "/images/soundcore_liberty_4_nc_2.jpg",
      "/images/soundcore_liberty_4_nc_3.jpg",
    ],
    description: "Оригінал / Нові / Коробка відкрита / Гарантій немає",
  },
  soundcore_aerofit_pro: {
    name: "Soundcore AeroFit Pro",
    price: 189,
    colors: ["black", "blue"],
    images: [
      "/images/soundcore_aerofit_pro_1.jpg",
      "/images/soundcore_aerofit_pro_2.jpg",
      "/images/soundcore_aerofit_pro_3.jpg",
    ],
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

// Зберігання кошиків користувачів (в пам'яті, дані втрачаються при перезапуску)
const userCarts = new Map()

// Зберігання станів користувачів для процесу замовлення
const userStates = new Map() // userId -> { step: 'awaiting_name', orderData: {} }

const allOrders = [] // Масив для зберігання всіх замовлень

// ID адміністратора (замініть на ваш Telegram ID)
const ADMIN_ID = process.env.ADMIN_ID || 6486502899 // Замініть на ваш реальний Telegram ID

// --- Обробники команд та callback запитів ---

// Команда /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id
  // Очищаємо стан користувача при старті
  userStates.delete(chatId)

  const welcomeMessage = `🎧 Ласкаво просимо до магазину навушників Soundcore!

Всі навушники нові, але упаковка відкрита. Гарантій немає.

Оберіть дію:
  `

  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🛍️ Переглянути каталог", callback_data: "catalog" }],
        [{ text: "🛒 Мій кошик", callback_data: "cart" }],
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

  // Перевіряємо, чи це адміністратор
  if (userId !== ADMIN_ID) {
    await bot.sendMessage(chatId, "❌ У вас немає доступу до цієї команди.")
    return
  }

  if (allOrders.length === 0) {
    await bot.sendMessage(chatId, "📋 Замовлень поки немає.")
    return
  }

  let ordersMessage = `📋 Всі замовлення (${allOrders.length}):\n\n`

  allOrders.slice(-10).forEach((order, index) => {
    // Показуємо останні 10 замовлень
    ordersMessage += `🆔 #${order.orderId}\n`
    ordersMessage += `👤 ${order.customerData.fullName}\n`
    ordersMessage += `📞 ${order.customerData.phone}\n`
    ordersMessage += `📧 ${order.customerData.email}\n`
    ordersMessage += `🏠 ${order.customerData.address}, ${order.customerData.city}\n`
    ordersMessage += `💰 Сума: ${order.total > 0 ? `$${order.total}` : "Уточнюйте"}\n`
    ordersMessage += `📅 ${new Date(order.timestamp).toLocaleString("uk-UA")}\n`
    ordersMessage += `📦 Товари: ${order.items.length} шт.\n\n`
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

  await bot.answerCallbackQuery(callbackQuery.id) // Відповідаємо негайно
  console.log("DEBUG: Answered callback query:", callbackQuery.id) // Додаємо лог для підтвердження
  console.log("Received callback query data:", data)

  try {
    // Якщо користувач знаходиться в процесі замовлення, ініціюємо скасування
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
      await startCheckout(chatId, userId) // Нова функція для початку оформлення
    } else if (data === "back_to_catalog") {
      await showCatalog(chatId)
    } else if (data === "back_to_main") {
      await showMainMenu(chatId)
    } else if (data === "cancel_order") {
      await cancelOrder(chatId)
    }

    // await bot.answerCallbackQuery(callbackQuery.id)
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

  // Ігноруємо команди, якщо вони не є частиною поточного стану
  if (text.startsWith("/") && text !== "/start") {
    if (userStates.has(chatId)) {
      await bot.sendMessage(
        chatId,
        "Будь ласка, завершіть або скасуйте поточне замовлення, перш ніж використовувати команди.",
      )
    }
    return
  }

  // Якщо це команда /start, обробляємо її окремо
  if (text === "/start") {
    // bot.onText(/\/start/) вже обробить це
    return
  }

  const currentState = userStates.get(chatId)
  if (currentState) {
    try {
      switch (currentState.step) {
        case "awaiting_name":
          currentState.orderData.fullName = text
          currentState.step = "awaiting_email"
          await bot.sendMessage(chatId, "Введіть вашу електронну пошту (email):", {
            reply_markup: {
              inline_keyboard: [[{ text: "❌ Скасувати замовлення", callback_data: "cancel_order" }]],
            },
          })
          break

        case "awaiting_email":
          if (!/\S+@\S+\.\S+/.test(text)) {
            await bot.sendMessage(chatId, "Будь ласка, введіть коректну електронну пошту.")
            return
          }
          currentState.orderData.email = text
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
          currentState.step = "awaiting_address"
          await bot.sendMessage(chatId, "Введіть вашу адресу доставки (вулиця, будинок, квартира):", {
            reply_markup: {
              inline_keyboard: [[{ text: "❌ Скасувати замовлення", callback_data: "cancel_order" }]],
            },
          })
          break

        case "awaiting_address":
          currentState.orderData.address = text
          currentState.step = "awaiting_city"
          await bot.sendMessage(chatId, "Введіть ваше місто:", {
            reply_markup: {
              inline_keyboard: [[{ text: "❌ Скасувати замовлення", callback_data: "cancel_order" }]],
            },
          })
          break

        case "awaiting_city":
          currentState.orderData.city = text
          userStates.delete(chatId) // Завершуємо стан
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
  } else {
    // Якщо немає активного стану, ігноруємо текстові повідомлення або відповідаємо стандартно
    // await bot.sendMessage(chatId, 'Я не розумію цю команду. Будь ласка, скористайтеся кнопками або командою /start.');
  }
})

// Показати головне меню
async function showMainMenu(chatId) {
  const welcomeMessage = `🎧 Ласкаво просимо до магазину навушників Soundcore!

Всі навушники нові, але упаковка відкрита. Гарантій немає.

Оберіть дію:
  `

  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🛍️ Переглянути каталог", callback_data: "catalog" }],
        [{ text: "🛒 Мій кошик", callback_data: "cart" }],
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

  const currentWebhookUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://example.com"

  const productMessage = `🎧 ${product.name}

${typeof product.price === "number" ? `💰 Ціна: $${product.price}` : "💰 Ціна: Уточнюйте"}

📝 ${product.description}

🎨 Доступні кольори:
  `

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
    if (Array.isArray(product.images) && product.images.length > 0) {
      const media = product.images.map((imgPath, index) => ({
        type: "photo",
        media: `${currentWebhookUrl}${imgPath}`,
        caption: index === 0 ? productMessage : undefined, // Опис тільки для першого фото в альбомі
      }))

      await bot.sendMediaGroup(chatId, media, { reply_markup: options.reply_markup })
    } else {
      // Запасний варіант, якщо images не є масивом або порожній
      const imageUrl = `${currentWebhookUrl}/placeholder.svg?height=300&width=300&text=No+Image`
      await bot.sendPhoto(chatId, imageUrl, {
        caption: productMessage,
        reply_markup: options.reply_markup,
      })
    }
  } catch (error) {
    console.error("Error sending product media/photo:", error)
    // Запасний варіант: відправити текстове повідомлення, якщо фото не вдалося
    try {
      await bot.sendMessage(chatId, `Помилка завантаження фото. ${productMessage}`, options)
    } catch (fallbackError) {
      console.error("Error sending fallback message:", fallbackError)
    }
  }
}

// Вибір кольору - тепер автоматично додає до кошика
async function selectColor(chatId, userId, productId, color) {
  const product = headphones[productId]
  if (!product) return

  // Автоматично додаємо товар до кошика
  if (!userCarts.has(userId)) {
    userCarts.set(userId, [])
  }

  const cart = userCarts.get(userId)
  cart.push({
    productId,
    name: product.name,
    color,
    price: product.price, // Зберігаємо ціну як є (рядок або число)
  })

  const successMessage = `✅ Товар автоматично додано до кошика!

🎧 ${product.name}
🎨 ${colorEmojis[color]}
${typeof product.price === "number" ? `💰 $${product.price}` : "💰 Ціну уточнюйте"}

Що бажаєте зробити далі?
  `

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
    price: product.price, // Зберігаємо ціну як є (рядок або число)
  })

  const successMessage = `✅ Товар додано до кошика!

🎧 ${product.name}
🎨 ${colorEmojis[color]}
${typeof product.price === "number" ? `💰 $${product.price}` : "💰 Ціну уточнюйте"}

Що бажаєте зробити далі?
  `

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
  let total = 0 // Загальна сума, якщо всі ціни числові

  cart.forEach((item, index) => {
    cartMessage += `${index + 1}. ${item.name}\n`
    cartMessage += `   🎨 ${colorEmojis[item.color]}\n`
    cartMessage += `   💰 ${typeof item.price === "number" ? `$${item.price}` : "Ціну уточнюйте"}\n\n`

    // Додаємо до загальної суми, тільки якщо ціна числова
    if (typeof item.price === "number") {
      total += item.price
    }
  })

  cartMessage += `💳 Загальна сума: ${total > 0 ? `$${total}` : "Уточнюйте"}`

  const keyboard = cart.map((item, index) => [{ text: `❌ Видалити ${item.name}`, callback_data: `remove_${index}` }])

  keyboard.push(
    [{ text: "💳 Оформити замовлення", callback_data: "checkout" }],
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
      await showCart(chatId, userId) // Оновлюємо кошик після видалення
    } catch (error) {
      console.error("Error removing from cart or showing updated cart:", error)
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

// Завершення замовлення після збору всіх даних
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

  orderSummary += `--- Дані покупця ---\n`
  orderSummary += `👤 ПІБ: ${orderData.fullName}\n`
  orderSummary += `📧 Email: ${orderData.email}\n`
  orderSummary += `📞 Телефон: ${orderData.phone}\n`
  orderSummary += `🏠 Адреса: ${orderData.address}, ${orderData.city}\n\n`
  orderSummary += `💳 Загальна сума: ${total > 0 ? `$${total}` : "Уточнюйте"}\n\n`
  const orderId = Date.now()
  orderSummary += `🆔 Номер замовлення: #${orderId}\n\n`
  orderSummary += `Дякуємо за ваше замовлення! Ми зв'яжемося з вами найближчим часом.`

  const order = {
    orderId: orderId,
    timestamp: new Date().toISOString(),
    customerData: {
      fullName: orderData.fullName,
      email: orderData.email,
      phone: orderData.phone,
      address: orderData.address,
      city: orderData.city,
      userId: userId,
      chatId: chatId,
    },
    items: orderData.cart,
    total: total,
  }

  allOrders.push(order)
  console.log(`New order saved: #${orderId} from ${orderData.fullName}`)

  if (ADMIN_ID && ADMIN_ID !== 123456789) {
    // Перевіряємо, чи встановлений реальний ID адміністратора
    try {
      let adminNotification = `🔔 НОВЕ ЗАМОВЛЕННЯ #${orderId}\n\n`
      adminNotification += `👤 ${orderData.fullName}\n`
      adminNotification += `📞 ${orderData.phone}\n`
      adminNotification += `📧 ${orderData.email}\n`
      adminNotification += `🏠 ${orderData.address}, ${orderData.city}\n`
      adminNotification += `💰 Сума: ${total > 0 ? `$${total}` : "Уточнюйте"}\n\n`
      adminNotification += `📦 Товари:\n`
      orderData.cart.forEach((item, index) => {
        adminNotification += `${index + 1}. ${item.name} (${colorEmojis[item.color]})\n`
      })

      await bot.sendMessage(ADMIN_ID, adminNotification)
    } catch (error) {
      console.error("Error sending admin notification:", error)
    }
  }

  // Очищаємо кошик після оформлення
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
  } catch (error) {
    console.error("Error sending final order summary:", error)
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

// Експортуємо 'app' для Vercel Serverless Functions.
// Це дозволяє Vercel знайти ваш Express додаток.
export default app
