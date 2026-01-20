-- AlterTable: Update Admin table to use 'code' instead of 'username' and 'password'

-- Drop old indexes
DROP INDEX IF EXISTS "Admin_username_key";
DROP INDEX IF EXISTS "Admin_username_idx";

-- Drop old columns
ALTER TABLE "Admin" DROP COLUMN IF EXISTS "username";
ALTER TABLE "Admin" DROP COLUMN IF EXISTS "password";

-- Add new code column
ALTER TABLE "Admin" ADD COLUMN IF NOT EXISTS "code" TEXT;

-- Create unique constraint and index for code
CREATE UNIQUE INDEX IF NOT EXISTS "Admin_code_key" ON "Admin"("code");
CREATE INDEX IF NOT EXISTS "Admin_code_idx" ON "Admin"("code");
