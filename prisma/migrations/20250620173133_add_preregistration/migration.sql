-- CreateTable
CREATE TABLE `PreRegistration` (
    `id` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `dateOfBirth` DATETIME(3) NOT NULL,
    `placeOfBirth` VARCHAR(191) NOT NULL,
    `nationality` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `desiredProgramId` VARCHAR(191) NOT NULL,
    `entryYear` VARCHAR(191) NOT NULL,
    `examCenter` VARCHAR(191) NOT NULL,
    `diplomaCopyPath` VARCHAR(191) NULL,
    `transcriptsPath` VARCHAR(191) NULL,
    `photoPath` VARCHAR(191) NULL,
    `financierLastName` VARCHAR(191) NOT NULL,
    `financierFirstName` VARCHAR(191) NOT NULL,
    `financierAddress` VARCHAR(191) NOT NULL,
    `financierPhone` VARCHAR(191) NOT NULL,
    `financierEmail` VARCHAR(191) NOT NULL,
    `howDidYouHear` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PreRegistration_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PreRegistration` ADD CONSTRAINT `PreRegistration_desiredProgramId_fkey` FOREIGN KEY (`desiredProgramId`) REFERENCES `Formation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
