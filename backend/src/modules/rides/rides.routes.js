import prisma from '../../config/database.js';
import { calculatePrice } from '../../shared/utils/calculatePrice.js';
import { findNearestDriver } from '../../shared/utils/findDriver.js';

export async function createRide({ userId, origin, destination }) {
  // MOCK localização usuário
  const userLat = -19.9;
  const userLng = -43.9;

  const distance = 10;
  const duration = 15;

  const price = calculatePrice(distance, duration);

  // 🔥 busca motoristas no banco
  const drivers = await prisma.driver.findMany();

  // 🔥 escolhe o mais próximo
  const driver = findNearestDriver(drivers, userLat, userLng);

  if (!driver) {
    throw new Error('Nenhum motorista disponível');
  }

  // 🔥 cria corrida já com motorista
  const ride = await prisma.ride.create({
    data: {
      userId,
      driverId: driver.id,
      origin,
      destination,
      price,
      status: 'ACCEPTED'
    }
  });

  return ride;
} 