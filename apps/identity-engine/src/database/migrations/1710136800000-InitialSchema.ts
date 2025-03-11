import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1710136800000 implements MigrationInterface {
    name = 'InitialSchema1710136800000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                "email" VARCHAR(255) NOT NULL UNIQUE,
                "first_name" VARCHAR(100),
                "last_name" VARCHAR(100),
                "password_hash" TEXT NOT NULL,
                "active" BOOLEAN NOT NULL DEFAULT true,
                "email_verified" BOOLEAN NOT NULL DEFAULT false,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "last_login" TIMESTAMP,
                "avatar" TEXT
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "roles" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR(100) NOT NULL UNIQUE,
                "description" TEXT,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "permissions" (
                "id" SERIAL PRIMARY KEY,
                "code" VARCHAR(100) NOT NULL UNIQUE,
                "description" TEXT,
                "service" VARCHAR(100) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "user_roles" (
                "user_id" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                "role_id" INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                PRIMARY KEY (user_id, role_id)
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "role_permissions" (
                "role_id" INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
                "permission_id" INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                PRIMARY KEY (role_id, permission_id)
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "refresh_tokens" (
                "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                "user_id" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                "token" TEXT NOT NULL,
                "expires_at" TIMESTAMP NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "revoked_at" TIMESTAMP
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
        await queryRunner.query(`DROP TABLE "role_permissions"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}