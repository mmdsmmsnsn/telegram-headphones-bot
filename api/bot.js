import TelegramBot from "node-telegram-bot-api"
import express from "express"

// Замініть на ваш токен бота.
// На Vercel цей токен буде автоматично взято зі змінних середовища.
const token = process.env.TELEGRAM_BOT_TOKEN
const app = express()
const port = process.env.PORT || 3000 // Vercel надасть свій PORT

// Для webhook замість polling.
// Бот буде слухати HTTP запити від Telegram.
const bot = new TelegramBot(token)

// Middleware для обробки JSON запитів від Telegram.
app.use(express.json())

// Встановлення webhook.
// Vercel автоматично надає URL через змінну середовища VERCEL_URL.
// Якщо ви розгортаєте на іншій платформі, можливо, знадобиться інша змінна або ручне введення URL.
const webhookUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "YOUR_PUBLIC_DOMAIN_OR_IP"

if (webhookUrl && token) {
  // Встановлюємо webhook на Telegram API.
  // Шлях `/api/webhook` буде оброблятися нашим Express сервером.
  // bot.setWebHook(`${webhookUrl}/api/webhook`); // Закоментуйте цей рядок
  console.log(`Webhook встановлено на: ${webhookUrl}/api/webhook`)
} else {
  console.error("Webhook URL або Token не визначено. Бот може не працювати належним чином.")
}

// Обробка webhook зап��тів.
// Telegram надсилатиме оновлення на цей шлях.
app.post(`/api/webhook`, (req, res) => {
  bot.processUpdate(req.body)
  res.sendStatus(200) // Важливо завжди відповідати 200 OK, щоб Telegram знав, що запит отримано.
})

// Здоров'я сервісу (для перевірки, чи працює додаток).
// Ви можете перейти за цим URL у браузері, щоб перевірити, чи запущений ваш додаток.
app.get("/", (req, res) => {
  res.send("Telegram Bot is running!")
})

// --- База даних товарів (скопійовано з попереднього коду) ---
const headphones = {
  airpods_pro: {
    name: "Apple AirPods Pro",
    price: 249,
    colors: ["white", "black"],
    image: "/placeholder.svg?height=300&width=300",
    description: "Бездротові навушники з активним шумозаглушенням",
  },
  sony_wh1000xm4: {
    name: "Sony WH-1000XM4",
    price: 349,
    colors: ["black", "silver", "blue"],
    image: "/placeholder.svg?height=300&width=300",
    description: "Професійні накладні навушники з шумозаглушенням",
  },
  beats_studio3: {
    name: "Beats Studio3 Wireless",
    price: 199,
    colors: ["black", "red", "white", "blue"],
    image: "/placeholder.svg?height=300&width=300",
    description: "Стильні бездротові навушники з потужним басом",
  },
  bose_qc45: {
    name: "Bose QuietComfort 45",
    price: 329,
    colors: ["black", "white"],
    image: "/placeholder.svg?height=300&width=300",
    description: "Комфортні навушники з найкращим шумозаглушенням",
  },
}

// Кольори з емодзі
const colorEmojis = {
  white: "⚪ Білий",
  black: "⚫ Чорний",
  silver: "🔘 Сріблястий",
  blue: "🔵 Синій",
  red: "🔴 Червоний",
}

// Зберігання кошиків користувачів.
// Увага: при перезапуску сервера ці дані будуть втрачені.
// Для продакшену рекомендується використовувати базу даних (Supabase, Neon, MongoDB тощо).
const userCarts = new Map()

// --- Обробники команд та callback запитів (скопійовано з попереднього коду) ---

// Команда /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id
  const welcomeMessage = `
🎧 Ласкаво просимо до магазину навушників!

Тут ви можете придбати найкращі навушники від провідних брендів.

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
  const message = callbackQuery.message
  const chatId = message.chat.id
  const data = callbackQuery.data
  const userId = callbackQuery.from.id

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

    // Завжди відповідайте на callbackQuery, щоб кнопка не залишалася "завантаженою".
    await bot.answerCallbackQuery(callbackQuery.id)
  } catch (error) {
    console.error("Error handling callback:", error)
    await bot.answerCallbackQuery(callbackQuery.id, { text: "Виникла помилка" })
  }
})

// Показати головне меню
async function showMainMenu(chatId) {
  const welcomeMessage = `
🎧 Ласкаво просимо до магазину навушників!

Тут ви можете придбати найкращі навушники від провідних брендів.

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
  const catalogMessage = "🎧 Каталог навушників:\n\nОберіть модель для детального перегляду:"

  const keyboard = Object.keys(headphones).map((productId) => [
    {
      text: `${headphones[productId].name} - $${headphones[productId].price}`,
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

  const productMessage = `
🎧 ${product.name}

💰 Ціна: $${product.price}
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

  // Відправляємо фото з описом та кнопками
  await bot.sendPhoto(chatId, product.image, {
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
💰 Ціна: $${product.price}

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
    price: product.price,
  })

  const successMessage = `
✅ Товар додано до кошика!

🎧 ${product.name}
🎨 ${colorEmojis[color]}
💰 $${product.price}

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
  let total = 0

  cart.forEach((item, index) => {
    cartMessage += `${index + 1}. ${item.name}\n`
    cartMessage += `   🎨 ${colorEmojis[item.color]}\n`
    cartMessage += `   💰 $${item.price}\n\n`
    total += item.price
  })

  cartMessage += `💳 Загальна сума: $${total}`

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
    orderMessage += `   💰 $${item.price}\n\n`
    total += item.price
  })

  orderMessage += `💳 Загальна сума: $${total}\n\n`
  orderMessage += `📞 Для завершення замовлення, будь ласка, зв'яжіться з нами:\n`
  orderMessage += `📱 Телефон: +380123456789\n`
  orderMessage += `📧 Email: orders@headphones.com\n\n`
  orderMessage += `🆔 Номер замовлення: #${Date.now()}`

  // Очищаємо кошик після оформлення
  userCarts.set(userId, [])

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
ℹ️ Про наш магазин

🎧 Ми спеціалізуємося на продажу якісних навушників від провідних світових брендів.

✅ Наші переваги:
• Оригінальна продукція
• Гарантія на всі товари
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

// Експортуємо 'app' для Vercel Serverless Functions.
// Це дозволяє Vercel знайти ваш Express додаток.
export default app
