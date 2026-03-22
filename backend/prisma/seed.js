import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const FEATURE_NAMES = [
  "date_filter",
  "age_filter",
  "gender_filter",
  "bar_chart_click",
  "bar_chart_zoom",
  "line_chart_hover",
];

const GENDERS = ["Male", "Female", "Other"];

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.featureClick.deleteMany();
  await prisma.user.deleteMany();

  const users = [];
  for (let i = 0; i < 10; i++) {
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await prisma.user.create({
      data: {
        username: `user_${i}_${faker.internet
          .username()
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")}`,
        password: hashedPassword,
        age: faker.number.int({ min: 15, max: 65 }),
        gender: GENDERS[faker.number.int({ min: 0, max: 2 })],
      },
    });
    users.push(user);
  }

  console.log(`✅ Created ${users.length} users`);

  const clickData = [];
  for (let i = 0; i < 150; i++) {
    const randomUser =
      users[faker.number.int({ min: 0, max: users.length - 1 })];
    const randomFeature =
      FEATURE_NAMES[
        faker.number.int({ min: 0, max: FEATURE_NAMES.length - 1 })
      ];
    const randomDate = faker.date.between({
      from: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      to: new Date(),
    });

    clickData.push({
      userId: randomUser.id,
      featureName: randomFeature,
      timestamp: randomDate,
    });
  }

  await prisma.featureClick.createMany({ data: clickData });

  console.log(`✅ Created 150 feature click events`);
  console.log("🎉 Seeding complete!");
  console.log("\n📋 Test credentials (any of these work):");
  users.slice(0, 3).forEach((u) => {
    console.log(`   username: ${u.username}  |  password: password123`);
  });
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
