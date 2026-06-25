/*
  Warnings:

  - The values [SCHEDULE] on the enum `AppoinmentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The `paymentStatus` column on the `appoinments` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AppoinmentStatus_new" AS ENUM ('SCHEDULED', 'INPROGRESS', 'COMPLETED', 'CANCELED');
ALTER TABLE "appoinments" ALTER COLUMN "status" TYPE "AppoinmentStatus_new" USING ("status"::text::"AppoinmentStatus_new");
ALTER TYPE "AppoinmentStatus" RENAME TO "AppoinmentStatus_old";
ALTER TYPE "AppoinmentStatus_new" RENAME TO "AppoinmentStatus";
DROP TYPE "public"."AppoinmentStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "appoinments" ALTER COLUMN "status" SET DEFAULT 'SCHEDULED',
DROP COLUMN "paymentStatus",
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID';
