/*
  Warnings:

  - You are about to drop the column `category` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `nextBillingDate` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `trialStartDate` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isAdmin` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `emailVerified` on the `User` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Boolean`.
  - Added the required column `userId` to the `Reminder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "icon" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
-- PRAGMA foreign_keys=OFF;

-- Create new table for Reminder
CREATE TABLE "new_Reminder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subscriptionId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "sent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL DEFAULT 'default-user-id',
    CONSTRAINT "Reminder_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Reminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Copy data from old table to new table
INSERT INTO "new_Reminder" ("createdAt", "date", "id", "sent", "subscriptionId", "updatedAt") 
SELECT "createdAt", "date", "id", "sent", "subscriptionId", "updatedAt" FROM "Reminder";

-- Update the userId field with the actual user ID from the subscription
UPDATE "new_Reminder" 
SET "userId" = (
    SELECT "s"."userId" 
    FROM "Subscription" "s" 
    WHERE "s"."id" = "new_Reminder"."subscriptionId"
);

-- Drop old table
DROP TABLE "Reminder";

-- Create new table with original name (instead of RENAME)
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subscriptionId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "sent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL DEFAULT 'default-user-id',
    CONSTRAINT "Reminder_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Reminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Copy data from the temporary table to the final table
INSERT INTO "Reminder" SELECT * FROM "new_Reminder";

-- Drop the temporary table
DROP TABLE "new_Reminder";

-- Create indices
CREATE INDEX "Reminder_subscriptionId_idx" ON "Reminder"("subscriptionId");
CREATE INDEX "Reminder_userId_idx" ON "Reminder"("userId");

-- Create new table for Subscription
CREATE TABLE "new_Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "billingCycle" TEXT NOT NULL DEFAULT 'monthly',
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATETIME,
    "trialEndDate" DATETIME,
    "autoRenew" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "logo" TEXT,
    "website" TEXT,
    "cancellationUrl" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Subscription_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Copy data from old table to new table
INSERT INTO "new_Subscription" ("billingCycle", "cancellationUrl", "createdAt", "description", "id", "logo", "name", "notes", "price", "trialEndDate", "updatedAt", "userId", "website") 
SELECT "billingCycle", "cancellationUrl", "createdAt", "description", "id", "logo", "name", "notes", "price", "trialEndDate", "updatedAt", "userId", "website" FROM "Subscription";

-- Drop old table
DROP TABLE "Subscription";

-- Create new table with original name (instead of RENAME)
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "billingCycle" TEXT NOT NULL DEFAULT 'monthly',
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATETIME,
    "trialEndDate" DATETIME,
    "autoRenew" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "logo" TEXT,
    "website" TEXT,
    "cancellationUrl" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Subscription_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Copy data from the temporary table to the final table
INSERT INTO "Subscription" SELECT * FROM "new_Subscription";

-- Drop the temporary table
DROP TABLE "new_Subscription";

-- Create indices
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");
CREATE INDEX "Subscription_categoryId_idx" ON "Subscription"("categoryId");

-- Create new table for User
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL DEFAULT '',
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "resetPasswordToken" TEXT,
    "resetPasswordExpires" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Copy data from old table to new table with coalesce for nullable fields
INSERT INTO "new_User" ("createdAt", "email", "emailVerified", "id", "name", "password", "updatedAt") 
SELECT "createdAt", "email", coalesce("emailVerified", false) AS "emailVerified", "id", "name", COALESCE("password", '') AS "password", "updatedAt" FROM "User";

-- Drop old table
DROP TABLE "User";

-- Create new table with original name (instead of RENAME)
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL DEFAULT '',
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "resetPasswordToken" TEXT,
    "resetPasswordExpires" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Copy data from the temporary table to the final table
INSERT INTO "User" SELECT * FROM "new_User";

-- Drop the temporary table
DROP TABLE "new_User";

-- Create indices
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Re-enable foreign keys
-- PRAGMA foreign_keys=ON;

-- Create index for Category
CREATE INDEX "Category_userId_idx" ON "Category"("userId");
