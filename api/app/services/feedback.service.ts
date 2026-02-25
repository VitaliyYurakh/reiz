import {prisma} from '../utils';
import {logger} from '../utils';
import telegramService from './telegram.service';
import rentalRequestService from './rental-request.service';
import {
    BookingRequestDto,
    ContactRequestDto,
    CallbackRequestDto,
    BusinessRequestDto,
    InvestRequestDto,
} from '../types/dto.types';

class FeedbackService {
    async createBookingRequest(data: BookingRequestDto) {
        try {
            const bookingRequest = await prisma.bookingRequest.create({
                data: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phone: data.phone,
                    email: data.email,
                    pickupLocation: data.pickupLocation,
                    returnLocation: data.returnLocation,
                    startDate: new Date(data.startDate),
                    endDate: new Date(data.endDate),
                    flightNumber: data.flightNumber,
                    comment: data.comment,
                    carId: data.carId,
                    carDetails: data.carDetails,
                    selectedPlan: data.selectedPlan,
                    selectedExtras: data.selectedExtras,
                    totalDays: data.totalDays,
                    priceBreakdown: data.priceBreakdown,
                    telegramSent: false,
                },
            });

            try {
                const message = await telegramService.formatBookingRequest({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phone: data.phone,
                    email: data.email,
                    pickupLocation: data.pickupLocation,
                    returnLocation: data.returnLocation,
                    startDate: bookingRequest.startDate,
                    endDate: bookingRequest.endDate,
                    flightNumber: data.flightNumber,
                    comment: data.comment,
                    carDetails: data.carDetails,
                    selectedPlan: data.selectedPlan,
                    selectedExtras: data.selectedExtras,
                    totalDays: data.totalDays,
                    priceBreakdown: data.priceBreakdown,
                });
                const sent = await telegramService.sendMessage(message);

                if (sent) {
                    await prisma.bookingRequest.update({
                        where: {id: bookingRequest.id},
                        data: {telegramSent: true},
                    });
                }
            } catch (error) {
                logger.error(`Failed to send Telegram notification for booking ${bookingRequest.id}: ${error.message}`);
            }

            // Auto-create RentalRequest for CRM
            try {
                await rentalRequestService.createFromBookingRequest(bookingRequest.id);
                logger.info(`RentalRequest created for BookingRequest ${bookingRequest.id}`);
            } catch (error) {
                logger.error(`Failed to create RentalRequest for booking ${bookingRequest.id}: ${error.message}`);
            }

            return bookingRequest;
        } catch (error) {
            logger.error(`Failed to create booking request: ${error.message}`);
            throw error;
        }
    }

    async createContactRequest(data: ContactRequestDto) {
        try {
            const contactRequest = await prisma.contactRequest.create({
                data: {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    message: data.message,
                    telegramSent: false,
                },
            });

            try {
                const message = telegramService.formatContactRequest(data);
                const sent = await telegramService.sendMessage(message);

                if (sent) {
                    await prisma.contactRequest.update({
                        where: {id: contactRequest.id},
                        data: {telegramSent: true},
                    });
                }
            } catch (error) {
                logger.error(`Failed to send Telegram notification for contact request ${contactRequest.id}: ${error.message}`);
            }

            return contactRequest;
        } catch (error) {
            logger.error(`Failed to create contact request: ${error.message}`);
            throw error;
        }
    }

    async createCallbackRequest(data: CallbackRequestDto) {
        try {
            const callbackRequest = await prisma.callbackRequest.create({
                data: {
                    name: data.name,
                    phone: data.phone,
                    contactMethod: data.contactMethod,
                    telegramSent: false,
                },
            });

            try {
                const message = telegramService.formatCallbackRequest(data);
                const sent = await telegramService.sendMessage(message);

                if (sent) {
                    await prisma.callbackRequest.update({
                        where: {id: callbackRequest.id},
                        data: {telegramSent: true},
                    });
                }
            } catch (error) {
                logger.error(`Failed to send Telegram notification for callback request ${callbackRequest.id}: ${error.message}`);
            }

            return callbackRequest;
        } catch (error) {
            logger.error(`Failed to create callback request: ${error.message}`);
            throw error;
        }
    }

    async createBusinessRequest(data: BusinessRequestDto) {
        try {
            const businessRequest = await prisma.businessRequest.create({
                data: {
                    name: data.name,
                    phone: data.phone,
                    email: data.email,
                    message: data.message,
                    telegramSent: false,
                },
            });

            try {
                const message = telegramService.formatBusinessRequest(data);
                const sent = await telegramService.sendMessage(message);

                if (sent) {
                    await prisma.businessRequest.update({
                        where: {id: businessRequest.id},
                        data: {telegramSent: true},
                    });
                }
            } catch (error) {
                logger.error(`Failed to send Telegram notification for business request ${businessRequest.id}: ${error.message}`);
            }

            return businessRequest;
        } catch (error) {
            logger.error(`Failed to create business request: ${error.message}`);
            throw error;
        }
    }
    async createInvestRequest(data: InvestRequestDto) {
        try {
            const carInfo = [
                `${data.car} ${data.model}`,
                data.year && `Рік: ${data.year}`,
                data.transmission && `КПП: ${data.transmission}`,
                data.mileage && `Пробіг: ${data.mileage}`,
                data.color && `Колір: ${data.color}`,
                data.complect && `Комплектація: ${data.complect}`,
            ].filter(Boolean).join(', ');

            const businessRequest = await prisma.businessRequest.create({
                data: {
                    name: data.name,
                    phone: data.phone,
                    email: data.email,
                    message: `[Інвестиція] ${carInfo}`,
                    telegramSent: false,
                },
            });

            try {
                const message = telegramService.formatInvestRequest(data);
                const sent = await telegramService.sendMessage(message);

                if (sent) {
                    await prisma.businessRequest.update({
                        where: {id: businessRequest.id},
                        data: {telegramSent: true},
                    });
                }
            } catch (error) {
                logger.error(`Failed to send Telegram notification for invest request ${businessRequest.id}: ${error.message}`);
            }

            return businessRequest;
        } catch (error) {
            logger.error(`Failed to create invest request: ${error.message}`);
            throw error;
        }
    }
}

export default new FeedbackService();
