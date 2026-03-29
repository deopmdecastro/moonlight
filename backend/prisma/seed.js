import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.siteContent.upsert({
    where: { key: 'loyalty' },
    create: {
      key: 'loyalty',
      value: {
        point_value_eur: 0.01,
        reward_text_points: 10,
        reward_image_points: 10,
        reward_video_points: 20,
      },
    },
    update: {},
  })

  await prisma.siteContent.upsert({
    where: { key: 'appointments' },
    create: {
      key: 'appointments',
      value: { enabled: true },
    },
    update: {},
  })

  // Sample appointments data
  const staff1 = await prisma.staffMember.upsert({
    where: { name: 'João Silva' },
    create: { name: 'João Silva', email: 'joao@zana.com', phone: '+351 912345678', is_active: true },
    update: {},
  });

  const staff2 = await prisma.staffMember.upsert({
    where: { name: 'Maria Santos' },
    create: { name: 'Maria Santos', email: 'maria@zana.com', is_active: true },
    update: {},
  });

  const service1 = await prisma.service.upsert({
    where: { name: 'Consulta Inicial' },
    create: { name: 'Consulta Inicial', durationMinutes: 30, price: 25, is_active: true },
    update: {},
  });

  const service2 = await prisma.service.upsert({
    where: { name: 'Serviço Premium' },
    create: { name: 'Serviço Premium', durationMinutes: 45, price: 50, is_active: true },
    update: {},
  });

  // Link staff to services
  await prisma.staffService.upsert({
    where: { staffId_serviceId: { staffId: staff1.id, serviceId: service1.id } },
    create: { staffId: staff1.id, serviceId: service1.id },
    update: {},
  });
  await prisma.staffService.upsert({
    where: { staffId_serviceId: { staffId: staff1.id, serviceId: service2.id } },
    create: { staffId: staff1.id, serviceId: service2.id },
    update: {},
  });
  await prisma.staffService.upsert({
    where: { staffId_serviceId: { staffId: staff2.id, serviceId: service2.id } },
    create: { staffId: staff2.id, serviceId: service2.id },
    update: {},
  });

  const count = await prisma.product.count()
  if (count > 0) return

  await prisma.product.createMany({
    data: [
      {
        name: 'Colar Pérola',
        description: 'Colar delicado com pérolas.',
        price: '19.90',
        category: 'colares',
        material: 'perolas',
        images: [],
        colors: ['branco'],
        stock: 10,
        isFeatured: true,
        status: 'active',
      },
      {
        name: 'Brinco Aço Inox',
        description: 'Brinco resistente em aço inox.',
        price: '9.90',
        category: 'brincos',
        material: 'aco_inox',
        images: [],
        colors: ['prata'],
        stock: 25,
        isNew: true,
        status: 'active',
      },
    ],
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
