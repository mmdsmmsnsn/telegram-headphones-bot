const { Telegraf, Markup } = require('telegraf');
const { Vercel } = require('vercel'); // Цей модуль зазвичай не потрібен, але Telegraf має вбудовану підтримку Vercel.

// 1. НАЛАШТУВАННЯ ТА ІНІЦІАЛІЗАЦІЯ
// Токен береться зі змінних середовища Vercel (TELEGRAM_BOT_TOKEN)
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Обов'язково переконайтеся, що ви встановили токен на Vercel!
if (!BOT_TOKEN) {
    console.error('Error: TELEGRAM_BOT_TOKEN is not set in environment variables.');
    // Повертаємо пусту функцію, щоб Vercel не видавав помилку
    module.exports = (req, res) => res.status(200).send('Bot is not configured.');
    return; 
}

const bot = new Telegraf(BOT_TOKEN);

// 2. ДАНІ КАТАЛОГУ (Тут можна використовувати базу даних)
const PRODUCTS = {
    'airpods': { name: 'AirPods Pro 2', price: 250.00, desc: 'Активне шумозаглушення.' },
    'jbl_tune': { name: 'JBL Tune 510BT', price: 50.00, desc: 'Доступні накладні.' },
    'sony_xm5': { name: 'Sony WH-1000XM5', price: 350.00, desc: 'Преміум-якість звуку.' },
};

// Сховище для кошиків (Не постійне на Vercel!)
const carts = {};

// 3. ФУНКЦІЇ МЕНЮ ТА КНОПОК

const getStartMenu = () => {
    return Markup.inlineKeyboard([
        [Markup.button.callback('🎧 Каталог Навушників', 'show_catalog')],
        [Markup.button.callback('🛒 Перейти до Кошика', 'show_cart')],
        [Markup.button.url('📞 Зв\'язатися з нами', 'https://t.me/COREBOX_SUPPORT')],
    ]);
};

// Команда /start
bot.start((ctx) => {
    ctx.reply('Привіт! Я ваш бот-помічник з продажу навушників COREBOX.SHOP.\nОберіть потрібну дію:', getStartMenu());
});

// Функція для показу каталогу
bot.action('show_catalog', (ctx) => {
    let text = 'Наш асортимент:\n\n';
    const keyboard = [];

    for (const id in PRODUCTS) {
        const product = PRODUCTS[id];
        text += `*${product.name}*\n`;
        text += `Ціна: $${product.price.toFixed(2)}\n`;
        text += `Опис: ${product.desc}\n\n`;
        keyboard.push([Markup.button.callback(`➕ Додати ${product.name}`, `add_to_cart_${id}`)]);
    }
    
    keyboard.push([Markup.button.callback('⬅️ Назад до Головного Меню', 'start_menu')]);
    
    ctx.editMessageText(text, {
        parse_mode: 'Markdown',
        reply_markup: Markup.inlineKeyboard(keyboard)
    });
});

// Додавання до кошика
bot.action(/add_to_cart_(.+)/, (ctx) => {
    const productId = ctx.match[1];
    const product = PRODUCTS[productId];
    const chatId = ctx.chat.id;

    if (!carts[chatId]) {
        carts[chatId] = {};
    }

    carts[chatId][productId] = (carts[chatId][productId] || 0) + 1;

    ctx.answerCbQuery(`✅ ${product.name} додано до кошика!`);
    
    ctx.editMessageText(`Товар ${product.name} додано. Що робити далі?`, {
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('🛒 Перейти до Кошика', 'show_cart')],
            [Markup.button.callback('🎧 Продовжити покупки', 'show_catalog')]
        ])
    });
});

// Показ кошика
bot.action('show_cart', (ctx) => {
    const chatId = ctx.chat.id;
    let text;
    let keyboard;
    let totalPrice = 0;

    if (!carts[chatId] || Object.keys(carts[chatId]).length === 0) {
        text = 'Ваш кошик порожній 😔. Час обрати ідеальні навушники!';
        keyboard = [[Markup.button.callback('🎧 Перейти до Каталогу', 'show_catalog')]];
    } else {
        text = '🛒 **Ваш Кошик:**\n\n';
        
        for (const id in carts[chatId]) {
            const quantity = carts[chatId][id];
            const product = PRODUCTS[id];
            const subtotal = product.price * quantity;
            totalPrice += subtotal;

            text += `*${product.name}* — ${quantity} шт. x $${product.price.toFixed(2)} = $${subtotal.toFixed(2)}\n`;
        }
        
        text += `\n💰 **Загальна сума: $${totalPrice.toFixed(2)}**`;
        
        keyboard = [
            [Markup.button.callback('✅ Оформити Замовлення', 'checkout')],
            [Markup.button.callback('❌ Очистити Кошик', 'clear_cart')],
            [Markup.button.callback('⬅️ Продовжити покупки', 'show_catalog')],
        ];
    }
    
    ctx.editMessageText(text, {
        parse_mode: 'Markdown',
        reply_markup: Markup.inlineKeyboard(keyboard)
    });
});

// Оформлення замовлення
bot.action('checkout', (ctx) => {
    ctx.answerCbQuery();
    delete carts[ctx.chat.id]; // Очищуємо кошик після оформлення
    ctx.editMessageText('Дякуємо за замовлення!\nМенеджер COREBOX.SHOP зв\'яжеться з вами для уточнення деталей.', getStartMenu());
});

// Очищення кошика
bot.action('clear_cart', (ctx) => {
    delete carts[ctx.chat.id];
    ctx.answerCbQuery('Кошик очищено!', true);
    ctx.editMessageText('Кошик очищено! Оберіть, будь ласка, щось інше.', getStartMenu());
});

// Повернення до головного меню
bot.action('start_menu', (ctx) => {
    ctx.answerCbQuery();
    ctx.editMessageText('Ви повернулися до головного меню.', getStartMenu());
});


// 4. КОНФІГУРАЦІЯ WEBHOOK ДЛЯ VERCEL

// Ця функція є єдиною точкою входу для Vercel
module.exports = async (req, res) => {
    try {
        await bot.handleUpdate(req.body, res);
    } catch (err) {
        console.error('Error handling update:', err);
        res.status(500).send('Internal Server Error');
    }
    
    // Якщо Telegraf вже відповів, тут ми нічого не робимо,
    // інакше відправляємо 200 OK
    if (!res.headersSent) {
        res.status(200).send('OK');
    }
};