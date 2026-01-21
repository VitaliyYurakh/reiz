import {logger} from '../utils';

interface TelegramMessage {
    chat_id: string;
    text: string;
    parse_mode: 'HTML';
}

interface ExchangeRates {
    uah: number;
    usd: number;
}

class TelegramService {
    private botToken: string;
    private chatId: string;
    private apiUrl: string;
    private cachedRates: ExchangeRates | null = null;
    private lastFetchTime: number = 0;
    private readonly CACHE_DURATION = 3600000; // 1 hour in milliseconds

    constructor() {
        this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
        this.chatId = process.env.TELEGRAM_CHAT_ID || '';
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

            // Apply 2% margin to protect business from rate fluctuations
            const MARGIN = 1.02;
            const baseUahRate = data.rates.UAH || 44.5;
            const baseUsdRate = data.rates.USD || 1.08;

            this.cachedRates = {
                uah: parseFloat((baseUahRate * MARGIN).toFixed(2)),
                usd: parseFloat((baseUsdRate * MARGIN).toFixed(4)),
            };
            this.lastFetchTime = now;

            logger.info(`Exchange rates updated (with 2% margin): 1 EUR = ${this.cachedRates.uah} UAH (base: ${baseUahRate}), ${this.cachedRates.usd} USD (base: ${baseUsdRate})`);

            return this.cachedRates;
        } catch (error) {
            logger.error(`Failed to fetch exchange rates: ${error.message}`);

            // Return fallback rates if API fails (also with margin)
            return this.cachedRates || { uah: 45.4, usd: 1.10 };
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

        let message = `🚗 <b>Нова Заявка на Оренду</b>\n\n`;
        message += `👤 <b>Клієнт:</b> ${data.firstName} ${data.lastName}\n`;
        message += `📞 <b>Телефон:</b> ${data.phone}\n`;
        message += `📧 <b>Email:</b> ${data.email}\n\n`;

        if (data.carDetails) {
            const car = data.carDetails;
            message += `🚙 <b>Автомобіль:</b> ${car.brand} ${car.model}`;
            if (car.year) message += ` ${car.year}`;
            message += `\n`;
        }

        message += `📅 <b>Період:</b> ${formatDate(data.startDate)} - ${formatDate(data.endDate)}`;
        if (data.totalDays) {
            message += ` (${data.totalDays} ${this.getDaysWord(data.totalDays)})`;
        }
        message += `\n`;

        message += `📍 <b>Взяття:</b> ${data.pickupLocation}\n`;
        message += `📍 <b>Повернення:</b> ${data.returnLocation}\n`;

        if (data.flightNumber) {
            message += `✈️ <b>Рейс:</b> ${data.flightNumber}\n`;
        }

        // Detailed price breakdown
        if (data.priceBreakdown) {
            const breakdown = data.priceBreakdown;
            message += `\n💰 <b>Розклад вартості:</b>\n`;

            // Base rental cost
            if (breakdown.baseRentalCost) {
                const formattedPrice = await this.formatPrice(breakdown.baseRentalCost);
                message += `  • Оренда авто: ${formattedPrice}\n`;
            }

            // Insurance cost
            if (breakdown.insuranceCost && breakdown.insuranceCost > 0) {
                let insuranceLabel = '';
                if (data.selectedPlan && typeof data.selectedPlan === 'object') {
                    const depositPercent = data.selectedPlan.depositPercent;
                    if (depositPercent === 50) {
                        insuranceLabel = ' (застава 50%)';
                    } else if (depositPercent === 100) {
                        insuranceLabel = ' (застава 100%)';
                    } else if (depositPercent > 0) {
                        insuranceLabel = ` (застава ${depositPercent}%)`;
                    }
                }
                const formattedPrice = await this.formatPrice(breakdown.insuranceCost);
                message += `  • Страховка${insuranceLabel}: ${formattedPrice}\n`;
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
            message += `\n💬 <b>Коментар:</b> ${data.comment}`;
        }

        return message;
    }

    formatContactRequest(data: any): string {
        let message = `📧 <b>Нове Повідомлення з Форми Контактів</b>\n\n`;
        message += `👤 <b>Ім'я:</b> ${data.name}\n`;
        message += `📧 <b>Email:</b> ${data.email}\n`;
        message += `📞 <b>Телефон:</b> ${data.phone}\n`;

        if (data.message) {
            message += `\n💬 <b>Повідомлення:</b>\n${data.message}`;
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
        message += `👤 <b>Ім'я:</b> ${data.name}\n`;
        message += `📱 <b>Телефон:</b> ${data.phone}\n`;

        if (data.contactMethod) {
            message += `💬 <b>Метод зв'язку:</b> ${data.contactMethod}\n`;
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
        message += `👤 <b>Ім'я:</b> ${data.name}\n`;
        message += `📞 <b>Телефон:</b> ${data.phone}\n`;
        message += `📧 <b>Email:</b> ${data.email}\n`;

        if (data.message) {
            message += `\n💬 <b>Повідомлення:</b>\n${data.message}`;
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

    private getDaysWord(days: number): string {
        if (days % 10 === 1 && days % 100 !== 11) return 'день';
        if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) return 'дні';
        return 'днів';
    }
}

export default new TelegramService();
