import { PrismaClient, Priority, VehicleStatus } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  const warehouses = [
    { id: randomUUID(), name: 'Kyiv Central Hub', lat: 50.4501, lng: 30.5234, city: 'Kyiv', region: 'Kyiv Oblast' },
    { id: randomUUID(), name: 'Lviv Western Depot', lat: 49.8397, lng: 24.0297, city: 'Lviv', region: 'Lviv Oblast' },
    { id: randomUUID(), name: 'Dnipro Eastern Base', lat: 48.4647, lng: 35.0462, city: 'Dnipro', region: 'Dnipropetrovsk Oblast' },
    { id: randomUUID(), name: 'Odesa Southern Hub', lat: 46.4825, lng: 30.7233, city: 'Odesa', region: 'Odesa Oblast' },
  ];

  for (const w of warehouses) {
    await prisma.warehouse.upsert({
      where: { id: w.id },
      update: {},
      create: w,
    });
  }

  const resourcesData = [
    { name: 'Medical Kits (IFAK)', quantity: 2000 },
    { name: 'MREs (Meals Ready-to-Eat)', quantity: 15000 },
    { name: 'FPV Drones', quantity: 500 },
    { name: 'Starlink Terminals', quantity: 100 },
    { name: 'Winter Uniforms', quantity: 3000 },
  ];

  for (const w of warehouses) {
    for (const r of resourcesData) {
      const quantity = Math.floor(r.quantity * (0.5 + Math.random() * 0.5));
      await prisma.resource.create({
        data: {
          id: randomUUID(),
          name: r.name,
          quantity,
          warehouseId: w.id,
          updatedAt: new Date(),
        },
      });
    }
  }

  const brigades = [
    { id: randomUUID(), name: '93rd Mechanized Brigade (Kholodnyi Yar)', lat: 48.5986, lng: 37.9980, priority: Priority.RED, needs: ['Drones', 'Ammunition', 'Medkits'] },
    { id: randomUUID(), name: '47th Mechanized Brigade (Magura)', lat: 47.4447, lng: 35.8361, priority: Priority.RED, needs: ['Vehicles', 'FPV Drones'] },
    { id: randomUUID(), name: '35th Marine Brigade', lat: 46.7358, lng: 33.0833, priority: Priority.YELLOW, needs: ['Boats', 'Starlinks', 'Medkits'] },
    { id: randomUUID(), name: '14th Mechanized Brigade', lat: 49.7126, lng: 37.6083, priority: Priority.GREEN, needs: ['Winter Uniforms', 'MREs'] },
    { id: randomUUID(), name: '3rd Assault Brigade', lat: 48.1500, lng: 37.7500, priority: Priority.RED, needs: ['Heavy ammo', 'Drones'] },
  ];

  for (const b of brigades) {
    await prisma.brigade.upsert({
      where: { id: b.id },
      update: {},
      create: b,
    });
  }

  const vehicles = [
    { id: randomUUID(), driverName: 'Oleksandr K.', lat: 50.4501, lng: 30.5234, status: VehicleStatus.IDLE, updatedAt: new Date() },
    { id: randomUUID(), driverName: 'Mykola V.', lat: 48.4647, lng: 35.0462, status: VehicleStatus.IDLE, updatedAt: new Date() },
    { id: randomUUID(), driverName: 'Dmytro P.', lat: 49.8397, lng: 24.0297, status: VehicleStatus.IDLE, updatedAt: new Date() },
    { id: randomUUID(), driverName: 'Ivan P.', lat: 46.4825, lng: 30.7233, status: VehicleStatus.IDLE, updatedAt: new Date() },
    { id: randomUUID(), driverName: 'Taras M.', lat: 48.4647, lng: 35.0462, status: VehicleStatus.IDLE, updatedAt: new Date() },
  ];

  for (const v of vehicles) {
    await prisma.vehicle.upsert({
      where: { id: v.id },
      update: {},
      create: v,
    });
  }

  const adminUser = {
    id: randomUUID(),
    email: 'admin@logistics.ua',
    name: 'Admin',
    password: 'dummy_hash_for_now',
    updatedAt: new Date()
  };

  await prisma.user.upsert({
    where: { email: adminUser.email },
    update: {},
    create: adminUser,
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
