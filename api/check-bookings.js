const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkBookings() {
  try {
    const bookings = await prisma.bookingRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        carId: true,
        carDetails: true,
        telegramSent: true,
        createdAt: true,
      },
    });

    console.log('\n=== Recent Booking Requests (Last 10) ===\n');

    if (bookings.length === 0) {
      console.log('No booking requests found in database.');
    } else {
      bookings.forEach((booking, index) => {
        console.log(`${index + 1}. ID: ${booking.id}`);
        console.log(`   Name: ${booking.firstName} ${booking.lastName}`);
        console.log(`   Email: ${booking.email}`);
        console.log(`   Phone: ${booking.phone}`);
        console.log(`   Car ID: ${booking.carId || 'N/A'}`);
        console.log(`   Car Details: ${booking.carDetails ? JSON.stringify(booking.carDetails) : 'N/A'}`);
        console.log(`   Telegram sent: ${booking.telegramSent ? 'YES ✓' : 'NO ✗'}`);
        console.log(`   Created: ${booking.createdAt.toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' })}`);
        console.log('');
      });
    }

    // Показати статистику
    const total = bookings.length;
    const telegramSent = bookings.filter(b => b.telegramSent).length;
    const telegramFailed = bookings.filter(b => !b.telegramSent).length;

    console.log('=== Statistics ===');
    console.log(`Total requests: ${total}`);
    console.log(`Telegram sent: ${telegramSent} (${total > 0 ? Math.round(telegramSent/total*100) : 0}%)`);
    console.log(`Telegram failed: ${telegramFailed} (${total > 0 ? Math.round(telegramFailed/total*100) : 0}%)`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkBookings();
