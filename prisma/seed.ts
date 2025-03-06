import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Define user roles
const USER_ROLES = {
  USER: "USER",
  MANAGER: "MANAGER",
  ADMIN: "ADMIN",
};

async function main() {
  console.log("Starting seed...");

  // Clear existing data
  await clearDatabase();

  // Create users
  const adminUser = await createUser({
    name: "Admin User",
    email: "admin@example.com",
    password: "Admin123!",
    role: USER_ROLES.ADMIN,
  });

  const managerUser = await createUser({
    name: "Manager User",
    email: "manager@example.com",
    password: "Manager123!",
    role: USER_ROLES.MANAGER,
  });

  const regularUser = await createUser({
    name: "Regular User",
    email: "user@example.com",
    password: "User123!",
    role: USER_ROLES.USER,
  });

  // Create categories
  const entertainmentCategory = await createCategory({
    name: "Entertainment",
    userId: regularUser.id,
    color: "#FF5733",
    icon: "film",
  });

  const productivityCategory = await createCategory({
    name: "Productivity",
    userId: regularUser.id,
    color: "#33FF57",
    icon: "briefcase",
  });

  // Create subscriptions for the regular user
  const now = new Date();
  const thirtyDaysFromNow = new Date(now);
  thirtyDaysFromNow.setDate(now.getDate() + 30);

  const fifteenDaysFromNow = new Date(now);
  fifteenDaysFromNow.setDate(now.getDate() + 15);

  const tenDaysFromNow = new Date(now);
  tenDaysFromNow.setDate(now.getDate() + 10);

  const fourteenDaysFromNow = new Date(now);
  fourteenDaysFromNow.setDate(now.getDate() + 14);

  const fiveDaysAgo = new Date(now);
  fiveDaysAgo.setDate(now.getDate() - 5);

  const netflixSub = await createSubscription({
    userId: regularUser.id,
    name: "Netflix",
    description: "Streaming service",
    price: 15.99,
    billingCycle: "monthly",
    startDate: now,
    trialEndDate: fourteenDaysFromNow,
    categoryId: entertainmentCategory.id,
    status: "active",
    website: "https://netflix.com",
    cancellationUrl: "https://netflix.com/cancel",
  });

  const spotifySub = await createSubscription({
    userId: regularUser.id,
    name: "Spotify",
    description: "Music streaming",
    price: 9.99,
    billingCycle: "monthly",
    startDate: now,
    trialEndDate: null,
    categoryId: entertainmentCategory.id,
    status: "active",
    website: "https://spotify.com",
    cancellationUrl: "https://spotify.com/account/cancel",
  });

  const adobeSub = await createSubscription({
    userId: regularUser.id,
    name: "Adobe Creative Cloud",
    description: "Creative tools and apps",
    price: 52.99,
    billingCycle: "monthly",
    startDate: now,
    trialEndDate: fiveDaysAgo,
    categoryId: productivityCategory.id,
    status: "active",
    website: "https://adobe.com",
    cancellationUrl: "https://adobe.com/account",
  });

  // Create reminders
  await createReminder({
    subscriptionId: netflixSub.id,
    date: new Date(fourteenDaysFromNow.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days before trial ends
    sent: false,
    userId: regularUser.id,
  });

  await createReminder({
    subscriptionId: spotifySub.id,
    date: new Date(fifteenDaysFromNow.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days before billing
    sent: false,
    userId: regularUser.id,
  });

  // Create notifications
  await createNotification({
    userId: regularUser.id,
    type: "reminder",
    title: "Netflix trial ending soon",
    message: "Your Netflix trial ends in 2 days",
    read: false,
  });

  await createNotification({
    userId: regularUser.id,
    type: "payment",
    title: "Spotify payment upcoming",
    message: "Your Spotify subscription payment is due in 5 days",
    read: true,
  });

  console.log("Seed completed!");
}

async function clearDatabase() {
  // Delete records in reverse order of dependencies
  await prisma.notification.deleteMany();
  await prisma.reminder.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.category.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
}

async function createUser({
  name,
  email,
  password,
  role,
}: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  console.log(
    `Created user: ${user.name} (${user.email}) with role ${user.role}`
  );
  return user;
}

async function createCategory({
  name,
  userId,
  color,
  icon,
}: {
  name: string;
  userId: string;
  color: string;
  icon: string;
}) {
  const category = await prisma.category.create({
    data: {
      name,
      userId,
      color,
      icon,
    },
  });

  console.log(`Created category: ${category.name} for user ${userId}`);
  return category;
}

async function createSubscription({
  userId,
  name,
  description,
  price,
  billingCycle,
  startDate,
  trialEndDate,
  categoryId,
  status,
  website,
  cancellationUrl,
}: {
  userId: string;
  name: string;
  description: string;
  price: number;
  billingCycle: string;
  startDate: Date;
  trialEndDate: Date | null;
  categoryId: string;
  status: string;
  website?: string;
  cancellationUrl?: string;
}) {
  const subscription = await prisma.subscription.create({
    data: {
      userId,
      name,
      description,
      price,
      billingCycle,
      startDate,
      trialEndDate,
      categoryId,
      status,
      website,
      cancellationUrl,
    },
  });

  console.log(`Created subscription: ${subscription.name} for user ${userId}`);
  return subscription;
}

async function createReminder({
  subscriptionId,
  date,
  sent,
  userId,
}: {
  subscriptionId: string;
  date: Date;
  sent: boolean;
  userId: string;
}) {
  const reminder = await prisma.reminder.create({
    data: {
      subscriptionId,
      date,
      sent,
      userId,
    },
  });

  console.log(
    `Created reminder for subscription ${subscriptionId} on ${reminder.date}`
  );
  return reminder;
}

async function createNotification({
  userId,
  type,
  title,
  message,
  read,
}: {
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
}) {
  const notification = await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      read,
    },
  });

  console.log(`Created notification: ${notification.title} for user ${userId}`);
  return notification;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
