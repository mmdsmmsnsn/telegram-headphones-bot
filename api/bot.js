// Цей лог має з'явитися в логах Vercel, якщо файл взагалі виконується
console.log("Bot file started! (Version with all logs)")

import TelegramBot from "node-telegram-bot-api"
import express from "express"

const token = process.env.TELEGRAM_BOT_TOKEN
const app = express()
const port = process.env.PORT || 3000

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
    price: "Ціну уточнюйте",
    colors: ["black", "pink"],
    image: "/placeholder.svg?height=300&width=300&text=Soundcore+P30i",
    description: "Оригінал / Нові / Упаковка відкрита / Гарантій немає",
  },
  soundcore_liberty_4: {
    name: "Soundcore Liberty 4",
    price: "Ціну уточнюйте",
    colors: ["black"],
    image: "/placeholder.svg?height=300&width=300&text=Soundcore+Liberty+4",
    description: "Оригінал / Нові / Упаковка відкрита / Гарантій немає",
  },
  soundcore_liberty_3_pro: {
    name: "Soundcore Liberty 3 Pro",
    price: "Ціну уточнюйте",
    colors: ["black", "white"],
    image: "/placeholder.svg?height=300&width=300&text=Soundcore+Liberty+3+Pro",
    description: "Оригінал / Нові / Упаковка відкрита / Гарантій немає",
  },
  soundcore_space_a40: {
    name: "Soundcore Space A40",
    price: "Ціну уточнюйте",
    colors: ["black", "white", "dark_blue"],
    image: "/placeholder.svg?height=300&width=300&text=Soundcore+Space+A40",
    description: "Оригінал / Нові / Упаковка відкрита / Гарантій немає",
  },
  soundcore_aerofit: {
    name: "Soundcore AeroFit",
    price: "Ціну уточнюйте",
    colors: ["black", "pink"],
    image: "/placeholder.svg?height=300&width=300&text=Soundcore+AeroFit",
    description: "Оригінал / Нові / Упаковка відкрита / Гарантій немає",
  },
  soundcore_a20_sleep: {
    name: "Soundcore A20 Sleep",
    price: "Ціну уточнюйте",
    colors: ["white"],
    image: "/placeholder.svg?height=300&width=300&text=Soundcore+A20+Sleep",
    description: "Оригінал / Нові / Упаковка відкрита / Гарантій немає",
  },
  soundcore_tune: {
    name: "Soundcore TUNE",
    price: "Ціну уточнюйте",
    colors: ["black"],
    image: "/placeholder.svg?height=300&width=300&text=Soundcore+TUNE",
    description: "Оригінал / Нові / Упаковка відкрита / Гарантій немає",
  },
  soundcore_q21i_nc: {
    name: "Soundcore Q21i NC",
    price: "Ціну уточнюйте",
    colors: ["black"],
    image: "/placeholder.svg?height=300&width=300&text=Soundcore+Q21i+NC",
    description: "Оригінал / Нові / Упаковка відкрита / Гарантій немає",
  },
  soundcore_space_one: {
    name: "Soundcore Space One",
    price: "Ціну уточнюйте",
    colors: ["black", "light_blue"],
    image: "/placeholder.svg?height=300&width=300&text=Soundcore+Space+One",
    description: "Оригінал / Нові / Упаковка відкрита / Гарантій немає",
  },
  soundcore_space_one_pro: {
    name: "Soundcore Space One Pro",
    price: "Ціну уточнюйте",
    colors: ["black", "cream"],
    image: "/placeholder.svg?height=300&width=300&text=Soundcore+Space+One+Pro",
    description: "Оригінал / Нові / Упаковка відкрита / Гарантій немає",
  },
  soundcore_liberty_4_pro: {
    name: "Soundcore Liberty 4 Pro",
    price: "Ціну уточнюйте",
    colors: ["black"],
    image: "/placeholder.svg?height=300&width=300&text=Soundcore+Liberty+4+Pro",
    description: "Оригінал / Нові / Коробка відкрита / Гарантій немає",
  },
  soundcore_liberty_4_nc: {
    name: "Soundcore Liberty 4 NC",
    price: "Ціну уточнюйте",
    colors: ["black", "white", "blue"],
    image: "/placeholder.svg?height=300&width=300&text=Soundcore+Liberty+4+NC",
    description: "Оригінал / Нові / Коробка відкрита / Гарантій немає",
  },
  soundcore_aerofit_pro: {
    name: "Soundcore AeroFit Pro",
    price: "Ціну уточнюйте",
    colors: ["black", "blue"],
    image: "/placeholder.svg?height=300&width=300&text=Soundcore+AeroFit+Pro",
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

// --- Обробники команд та callback запитів ---

// Команда /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id
  const welcomeMessage = `
🎧 Ласкаво просимо до магазину навушників Soundcore!

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

  await bot.sendMessage(chatId, welcomeMessage, options)
})

// Обробка callback запитів
bot.on("callback_query", async (callbackQuery) => {
  console.log("Callback query handler triggered!") // Лог, що обробник викликано
  const message = callbackQuery.message
  const chatId = message.chat.id
  const data = callbackQuery.data
  const userId = callbackQuery.from.id

  console.log("Received callback query data:", data) // Логуємо дані callback

  try {
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
      const [, productId, color] = data.split("_")
      await selectColor(chatId, userId, productId, color)
    } else if (data.startsWith("add_to_cart_")) {
      const [, , , productId, color] = data.split("_")
      await addToCart(chatId, userId, productId, color)
    } else if (data.startsWith("remove_")) {
      const itemIndex = Number.parseInt(data.replace("remove_", ""))
      await removeFromCart(chatId, userId, itemIndex)
    } else if (data === "checkout") {
      await checkout(chatId, userId)
    } else if (data === "back_to_catalog") {
      await showCatalog(chatId)
    } else if (data === "back_to_main") {
      await showMainMenu(chatId)
    }

    await bot.answerCallbackQuery(callbackQuery.id) // Завжди відповідаємо на callbackQuery
  } catch (error) {
    console.error("Error handling callback:", error)
    await bot.answerCallbackQuery(callbackQuery.id, { text: "Виникла помилка" })
  }
})

// Показати головне меню
async function showMainMenu(chatId) {
  const welcomeMessage = `
🎧 Ласкаво просимо до магазину навушників Soundcore!

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

  await bot.sendMessage(chatId, welcomeMessage, options)
}

// Показати каталог
async function showCatalog(chatId) {
  const catalogMessage = "🎧 Каталог навушників Soundcore:\n\nОберіть модель для детального перегляду:"

  const keyboard = Object.keys(headphones).map((productId) => [
    {
      text: `${headphones[productId].name} ${headphones[productId].price !== "Ціну уточнюйте" ? `- $${headphones[productId].price}` : ""}`,
      callback_data: `product_${productId}`,
    },
  ])

  keyboard.push([{ text: "🏠 Головне меню", callback_data: "back_to_main" }])

  const options = {
    reply_markup: {
      inline_keyboard: keyboard,
    },
  }

  await bot.sendMessage(chatId, catalogMessage, options)
}

// Показати продукт
async function showProduct(chatId, productId, userId) {
  const product = headphones[productId]
  if (!product) return

  // Отримуємо актуальний VERCEL_URL тут, щоб він завжди був свіжим
  const currentWebhookUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://example.com" // Запасний варіант для локального тестування

  const productMessage = `
🎧 ${product.name}

${product.price !== "Ціну уточнюйте" ? `💰 Ціна: $${product.price}` : "💰 Ціна: Уточнюйте"}
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

  // Конструюємо повну URL зображення
  const fullImageUrl = `${currentWebhookUrl}${product.image}`
  console.log("DEBUG: VERCEL_URL (inside showProduct):", process.env.VERCEL_URL) // Логуємо сирий VERCEL_URL
  console.log("DEBUG: Constructed fullImageUrl (inside showProduct):", fullImageUrl) // Логуємо сформовану URL

  await bot.sendPhoto(chatId, fullImageUrl, {
    caption: productMessage,
    reply_markup: options.reply_markup,
  })
}

// Вибір кольору
async function selectColor(chatId, userId, productId, color) {
  const product = headphones[productId]
  if (!product) return

  const confirmMessage = `
✅ Ви обрали:
🎧 ${product.name}
🎨 Колір: ${colorEmojis[color]}
${product.price !== "Ціну уточнюйте" ? `💰 Ціна: $${product.price}` : "💰 Ціна: Уточнюйте"}

Додати до кошика?
  `

  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🛒 Додати до кошика", callback_data: `add_to_cart_${productId}_${color}` }],
        [{ text: "🎨 Обрати інший колір", callback_data: `product_${productId}` }],
        [{ text: "⬅️ Назад до каталогу", callback_data: "back_to_catalog" }],
      ],
    },
  }

  await bot.sendMessage(chatId, confirmMessage, options)
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

  const successMessage = `
✅ Товар додано до кошика!

🎧 ${product.name}
🎨 ${colorEmojis[color]}
${product.price !== "Ціну уточнюйте" ? `💰 $${product.price}` : "💰 Ціна: Уточнюйте"}

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

  await bot.sendMessage(chatId, successMessage, options)
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
    await bot.sendMessage(chatId, emptyMessage, options)
    return
  }

  let cartMessage = "🛒 Ваш кошик:\n\n"
  let total = 0 // Загальна сума, якщо всі ціни числові

  cart.forEach((item, index) => {
    cartMessage += `${index + 1}. ${item.name}\n`
    cartMessage += `   🎨 ${colorEmojis[item.color]}\n`
    cartMessage += `   💰 ${item.price !== "Ціну уточнюйте" ? `$${item.price}` : "Ціну уточнюйте"}\n\n`

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

  await bot.sendMessage(chatId, cartMessage, options)
}

// Видалити з кошика
async function removeFromCart(chatId, userId, itemIndex) {
  const cart = userCarts.get(userId) || []

  if (itemIndex >= 0 && itemIndex < cart.length) {
    const removedItem = cart.splice(itemIndex, 1)[0]
    await bot.sendMessage(chatId, `✅ ${removedItem.name} видалено з кошика`)
    await showCart(chatId, userId) // Оновлюємо кошик після видалення
  }
}

// Оформлення замовлення
async function checkout(chatId, userId) {
  const cart = userCarts.get(userId) || []

  if (cart.length === 0) {
    await bot.sendMessage(chatId, "❌ Кошик порожній")
    return
  }

  let orderMessage = "📋 Ваше замовлення:\n\n"
  let total = 0

  cart.forEach((item, index) => {
    orderMessage += `${index + 1}. ${item.name}\n`
    orderMessage += `   🎨 ${colorEmojis[item.color]}\n`
    orderMessage += `   💰 ${item.price !== "Ціну уточнюйте" ? `$${item.price}` : "Ціну уточнюйте"}\n\n`

    if (typeof item.price === "number") {
      total += item.price
    }
  })

  orderMessage += `💳 Загальна сума: ${total > 0 ? `$${total}` : "Уточнюйте"}\n\n`
  orderMessage += `📞 Для завершення замовлення, будь ласка, зв'яжіться з нами:\n`
  orderMessage += `📱 Телефон: +380123456789\n`
  orderMessage += `📧 Email: orders@headphones.com\n\n`
  orderMessage += `🆔 Номер замовлення: #${Date.now()}`

  userCarts.set(userId, []) // Очищаємо кошик після оформлення

  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🛍️ Нове замовлення", callback_data: "catalog" }],
        [{ text: "🏠 Головне меню", callback_data: "back_to_main" }],
      ],
    },
  }

  await bot.sendMessage(chatId, orderMessage, options)
}

// Про нас
async function showAbout(chatId) {
  const aboutMessage = `
ℹ️ Про наш магазин Soundcore

🎧 Ми спеціалізуємося на продажу якісних навушників Soundcore. Всі навушники нові, але упаковка відкрита. Гарантій немає.

✅ Наші переваги:
• Оригінальна продукція
• Швидка доставка
• Професійна підтримка

📞 Контакти:
• Телефон: +380123456789
• Email: info@headphones.com
• Адреса: м. Київ, вул. Музична, 1

🕒 Режим роботи:
Пн-Пт: 9:00-18:00
Сб-Нд: 10:00-16:00
  `

  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🛍️ Перейти до каталогу", callback_data: "catalog" }],
        [{ text: "🏠 Головне меню", callback_data: "back_to_main" }],
      ],
    },
  }

  await bot.sendMessage(chatId, aboutMessage, options)
}

export default app
