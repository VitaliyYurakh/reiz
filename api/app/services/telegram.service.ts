import {logger} from '../utils';
import {env} from '../config/env';

interface TelegramMessage {
    chat_id: string;
    text: string;
    parse_mode: 'HTML';
}

interface ExchangeRates {
    uah: number;
    usd: number;
}

/**
 * Escape user-provided text for Telegram HTML parse mode.
 * Prevents HTML injection in messages.
 */
function escapeHtml(text: string | undefined | null): string {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

class TelegramService {
    private botToken: string;
    private chatId: string;
    private apiUrl: string;
    private cachedRates: ExchangeRates | null = null;
    private lastFetchTime: number = 0;
    private readonly CACHE_DURATION = 3600000; // 1 hour in milliseconds

    constructor() {
        this.botToken = env.TELEGRAM_BOT_TOKEN || '';
        this.chatId = env.TELEGRAM_CHAT_ID || '';
        this.apiUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
    }

    private async getExchangeRates(): Promise<ExchangeRates> {
        const now = Date.now();

        // Return cached rates if still valid
        if (this.cachedRates && (now - this.lastFetchTime) < this.CACHE_DURATION) {
            return this.cachedRates;
        }

        try {
            // Fetch rates from exchangerate API (free, no key required)
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');

            if (!response.ok) {
                throw new Error(`Exchange rate API error: ${response.status}`);
            }

            const data = await response.json();

            const uahRate = data.rates.UAH || 44.5;
            const usdRate = data.rates.USD || 1.08;

            this.cachedRates = {
                uah: parseFloat(uahRate.toFixed(2)),
                usd: parseFloat(usdRate.toFixed(4)),
            };
            this.lastFetchTime = now;

            logger.info(`Exchange rates updated: 1 EUR = ${this.cachedRates.uah} UAH, ${this.cachedRates.usd} USD`);

            return this.cachedRates;
        } catch (error) {
            logger.error(`Failed to fetch exchange rates: ${error.message}`);

            // Return fallback rates if API fails
            return this.cachedRates || { uah: 44.5, usd: 1.08 };
        }
    }

    private async formatPrice(eurAmount: number): Promise<string> {
        const rates = await this.getExchangeRates();
        const uah = Math.round(eurAmount * rates.uah);
        const usd = Math.round(eurAmount * rates.usd);
        return `€${eurAmount} (₴${uah} / $${usd})`;
    }

    async sendMessage(text: string): Promise<boolean> {
        if (!this.botToken || !this.chatId) {
            logger.error('Telegram bot token or chat ID not configured');
            return false;
        }

        try {
            const message: TelegramMessage = {
                chat_id: this.chatId,
                text,
                parse_mode: 'HTML',
            };

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                logger.error(`Telegram API error: ${response.status} - ${errorText}`);
                return false;
            }

            logger.info('Telegram notification sent successfully');
            return true;
        } catch (error) {
            if (error.name === 'AbortError') {
                logger.error('Telegram API request timeout');
            } else {
                logger.error(`Telegram API error: ${error.message}`);
            }
            return false;
        }
    }

    async formatBookingRequest(data: any): Promise<string> {
        const formatDate = (date: Date) => {
            return new Date(date).toLocaleDateString('uk-UA', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        };

        const formatTime = (date: Date) => {
            const d = new Date(date);
            const hh = String(d.getHours()).padStart(2, '0');
            const mm = String(d.getMinutes()).padStart(2, '0');
            return `${hh}:${mm}`;
        };

        let message = `🚗 <b>Нова Заявка на Оренду</b>\n\n`;
        message += `👤 <b>Клієнт:</b> ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}\n`;
        message += `📞 <b>Телефон:</b> ${escapeHtml(data.phone)}\n`;
        message += `📧 <b>Email:</b> ${escapeHtml(data.email)}\n\n`;

        if (data.carDetails) {
            const car = data.carDetails;
            message += `🚙 <b>Автомобіль:</b> ${escapeHtml(car.brand)} ${escapeHtml(car.model)}`;
            if (car.year) message += ` ${car.year}`;
            message += `\n`;
        }

        message += `📅 <b>Період:</b> ${formatDate(data.startDate)} - ${formatDate(data.endDate)}`;
        if (data.totalDays) {
            message += ` (${data.totalDays} ${this.getDaysWord(data.totalDays)})`;
        }
        message += `\n`;

        message += `📍 <b>Взяття:</b> ${escapeHtml(data.pickupLocation)}, ${formatDate(data.startDate)} о ${formatTime(data.startDate)}\n`;
        message += `📍 <b>Повернення:</b> ${escapeHtml(data.returnLocation)}, ${formatDate(data.endDate)} о ${formatTime(data.endDate)}\n`;

        if (data.flightNumber) {
            message += `✈️ <b>Рейс:</b> ${escapeHtml(data.flightNumber)}\n`;
        }

        // Detailed price breakdown
        if (data.priceBreakdown) {
            const breakdown = data.priceBreakdown;
            message += `\n💰 <b>Розклад вартості:</b>\n`;

            // Rental cost with daily rate
            if (breakdown.dailyPrice && data.totalDays) {
                const formattedDaily = await this.formatPrice(breakdown.dailyPrice);
                const formattedRental = await this.formatPrice(breakdown.rentalCost);
                message += `  • Оренда: ${formattedDaily}/день × ${data.totalDays} дн. = ${formattedRental}\n`;
            } else if (breakdown.rentalCost) {
                const formattedPrice = await this.formatPrice(breakdown.rentalCost);
                message += `  • Оренда авто: ${formattedPrice}\n`;
            }

            // Insurance/coverage info
            if (data.selectedPlan && typeof data.selectedPlan === 'object') {
                const depositPercent = data.selectedPlan.depositPercent;
                if (depositPercent != null && depositPercent > 0) {
                    message += `  • Покриття: застава ${depositPercent}%\n`;
                }
            }

            // Extras breakdown
            if (data.selectedExtras && Array.isArray(data.selectedExtras) && data.selectedExtras.length > 0) {
                const extrasMap: Record<string, string> = {
                    additionalDriver: 'Додатковий водій',
                    childSeat: 'Дитяче крісло',
                    borderCrossing: 'Перетин кордону',
                    driverService: 'Послуги водія',
                };

                for (const extra of data.selectedExtras) {
                    const name = extrasMap[extra.id] || extra.id;
                    const suffix = extra.isPerDay ? ` (×${extra.quantity} дн.)` : '';
                    const formattedPrice = await this.formatPrice(extra.cost);
                    message += `  • ${name}${suffix}: ${formattedPrice}\n`;
                }
            }

            // Total
            if (breakdown.totalCost) {
                const formattedPrice = await this.formatPrice(breakdown.totalCost);
                message += `\n<b>📊 ВСЬОГО:</b> ${formattedPrice}\n`;
            }

            // Deposit
            if (breakdown.depositAmount) {
                const formattedPrice = await this.formatPrice(breakdown.depositAmount);
                message += `<b>🔒 Застава:</b> ${formattedPrice}\n`;
            }
        } else if (data.totalCost) {
            // Fallback for old format
            message += `\n💰 <b>Сума:</b> €${data.totalCost}\n`;
        }

        if (data.comment) {
            message += `\n💬 <b>Коментар:</b> ${escapeHtml(data.comment)}`;
        }

        return message;
    }

    formatContactRequest(data: any): string {
        let message = `📧 <b>Нове Повідомлення з Форми Контактів</b>\n\n`;
        message += `👤 <b>Ім'я:</b> ${escapeHtml(data.name)}\n`;
        message += `📧 <b>Email:</b> ${escapeHtml(data.email)}\n`;
        message += `📞 <b>Телефон:</b> ${escapeHtml(data.phone)}\n`;

        if (data.message) {
            message += `\n💬 <b>Повідомлення:</b>\n${escapeHtml(data.message)}`;
        }

        const date = new Date().toLocaleString('uk-UA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
        message += `\n\n🕐 ${date}`;

        return message;
    }

    formatCallbackRequest(data: any): string {
        let message = `📞 <b>Запит на Дзвінок</b>\n\n`;
        message += `👤 <b>Ім'я:</b> ${escapeHtml(data.name)}\n`;
        message += `📱 <b>Телефон:</b> ${escapeHtml(data.phone)}\n`;

        if (data.contactMethod) {
            message += `💬 <b>Метод зв'язку:</b> ${escapeHtml(data.contactMethod)}\n`;
        }

        const date = new Date().toLocaleString('uk-UA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
        message += `\n🕐 ${date}`;

        return message;
    }

    formatBusinessRequest(data: any): string {
        let message = `💼 <b>Запит для Бізнесу</b>\n\n`;
        message += `👤 <b>Ім'я:</b> ${escapeHtml(data.name)}\n`;
        message += `📞 <b>Телефон:</b> ${escapeHtml(data.phone)}\n`;
        message += `📧 <b>Email:</b> ${escapeHtml(data.email)}\n`;

        if (data.message) {
            message += `\n💬 <b>Повідомлення:</b>\n${escapeHtml(data.message)}`;
        }

        const date = new Date().toLocaleString('uk-UA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
        message += `\n\n🕐 ${date}`;

        return message;
    }

    formatInvestRequest(data: any): string {
        let message = `📊 <b>Запит на Розрахунок Дохідності</b>\n\n`;
        message += `🚗 <b>Автомобіль:</b> ${escapeHtml(data.car)} ${escapeHtml(data.model)}\n`;

        if (data.year) message += `📅 <b>Рік:</b> ${escapeHtml(data.year)}\n`;
        if (data.transmission) message += `⚙️ <b>КПП:</b> ${escapeHtml(data.transmission)}\n`;
        if (data.mileage) message += `🛣️ <b>Пробіг:</b> ${escapeHtml(data.mileage)}\n`;
        if (data.color) message += `🎨 <b>Колір:</b> ${escapeHtml(data.color)}\n`;
        if (data.complect) message += `📋 <b>Комплектація:</b> ${escapeHtml(data.complect)}\n`;

        message += `\n👤 <b>Ім'я:</b> ${escapeHtml(data.name)}\n`;
        message += `📞 <b>Телефон:</b> ${escapeHtml(data.phone)}\n`;
        message += `📧 <b>Email:</b> ${escapeHtml(data.email)}\n`;

        const date = new Date().toLocaleString('uk-UA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
        message += `\n🕐 ${date}`;

        return message;
    }

    private getDaysWord(days: number): string {
        if (days % 10 === 1 && days % 100 !== 11) return 'день';
        if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) return 'дні';
        return 'днів';
    }
}

export default new TelegramService();
