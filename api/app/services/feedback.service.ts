import {prisma, logger, getErrorMessage} from '../utils';
import telegramService from './telegram.service';
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
            // If clientId provided, fetch client profile
            let client: any = null;
            if (data.clientId) {
                client = await prisma.client.findUnique({
                    where: {id: data.clientId, deletedAt: null},
                    select: {
                        id: true, firstName: true, lastName: true, phone: true, email: true,
                        driverLicenseNo: true, driverLicenseExpiry: true,
                        dateOfBirth: true, drivingSince: true,
                        totalCompletedRentals: true, loyaltyTier: true, rating: true,
                    },
                });
            }

            // BookingRequest used to be a separate table written first, then the
            // CRM-side RentalRequest mirror was generated as a follow-up. Now we
            // skip the intermediate row and write directly to RentalRequest with
            // `source='website'` — admins still see the same record they
            // approved/rejected, and there's only one source of truth. The
            // BookingRequest model remains in the schema (marked @deprecated)
            // for the legacy data rows that were created before this change.
            const startDate = new Date(data.startDate);
            const endDate = new Date(data.endDate);
            const websiteSnapshot = {
                carDetails: data.carDetails,
                selectedPlan: data.selectedPlan,
                selectedExtras: data.selectedExtras,
                totalDays: data.totalDays,
                priceBreakdown: data.priceBreakdown,
            };

            const rentalRequest = await prisma.rentalRequest.create({
                data: {
                    source: 'website',
                    status: 'new',
                    clientId: client?.id ?? null,
                    carId: data.carId ?? null,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phone: data.phone,
                    email: data.email,
                    pickupLocation: data.pickupLocation,
                    returnLocation: data.returnLocation,
                    pickupDate: startDate,
                    returnDate: endDate,
                    flightNumber: data.flightNumber,
                    comment: data.comment,
                    websiteSnapshot,
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
                    startDate,
                    endDate,
                    flightNumber: data.flightNumber,
                    comment: data.comment,
                    carDetails: data.carDetails,
                    selectedPlan: data.selectedPlan,
                    selectedExtras: data.selectedExtras,
                    totalDays: data.totalDays,
                    priceBreakdown: data.priceBreakdown,
                    clientProfile: client,
                });
                await telegramService.sendMessage(message);
            } catch (error) {
                logger.error(`Failed to send Telegram notification for booking #${rentalRequest.id}: ${getErrorMessage(error)}`);
            }

            logger.info(`RentalRequest #${rentalRequest.id} created for website booking`);
            return rentalRequest;
        } catch (error) {
            logger.error(`Failed to create booking request: ${getErrorMessage(error)}`);
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
                logger.error(`Failed to send Telegram notification for contact request ${contactRequest.id}: ${getErrorMessage(error)}`);
            }

            return contactRequest;
        } catch (error) {
            logger.error(`Failed to create contact request: ${getErrorMessage(error)}`);
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
                logger.error(`Failed to send Telegram notification for callback request ${callbackRequest.id}: ${getErrorMessage(error)}`);
            }

            return callbackRequest;
        } catch (error) {
            logger.error(`Failed to create callback request: ${getErrorMessage(error)}`);
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
                logger.error(`Failed to send Telegram notification for business request ${businessRequest.id}: ${getErrorMessage(error)}`);
            }

            return businessRequest;
        } catch (error) {
            logger.error(`Failed to create business request: ${getErrorMessage(error)}`);
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
                logger.error(`Failed to send Telegram notification for invest request ${businessRequest.id}: ${getErrorMessage(error)}`);
            }

            return businessRequest;
        } catch (error) {
            logger.error(`Failed to create invest request: ${getErrorMessage(error)}`);
            throw error;
        }
    }
}

export default new FeedbackService();
