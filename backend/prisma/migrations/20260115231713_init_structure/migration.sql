-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" TEXT NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "identity_number" VARCHAR(20),
    "role" VARCHAR(20) NOT NULL,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_profiles" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "school_name" TEXT NOT NULL,
    "npsn" TEXT NOT NULL,
    "school_status" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "principal_name" TEXT NOT NULL,
    "principal_nip" TEXT NOT NULL,
    "accreditation" TEXT NOT NULL,
    "curriculum" TEXT NOT NULL,
    "established_year" INTEGER NOT NULL,
    "license_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "province" TEXT,
    "city" TEXT,
    "district" TEXT,
    "postal_code" TEXT,
    "school_logo" TEXT,
    "foundation_logo" TEXT,
    "building_photo" TEXT,
    "social_links" TEXT[],
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "school_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_identity_number_key" ON "users"("identity_number");
