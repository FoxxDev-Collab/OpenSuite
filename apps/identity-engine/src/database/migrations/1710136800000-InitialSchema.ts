import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class InitialSchema1710136800000 implements MigrationInterface {
    name = 'InitialSchema1710136800000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Users table
        await queryRunner.createTable(new Table({
            name: "users",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    generationStrategy: "uuid",
                    default: "uuid_generate_v4()"
                },
                {
                    name: "email",
                    type: "varchar",
                    length: "255",
                    isUnique: true,
                    isNullable: false
                },
                {
                    name: "first_name",
                    type: "varchar",
                    length: "100",
                    isNullable: true
                },
                {
                    name: "last_name",
                    type: "varchar",
                    length: "100",
                    isNullable: true
                },
                {
                    name: "password_hash",
                    type: "text",
                    isNullable: false
                },
                {
                    name: "active",
                    type: "boolean",
                    default: true,
                    isNullable: false
                },
                {
                    name: "email_verified",
                    type: "boolean",
                    default: false,
                    isNullable: false
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()",
                    isNullable: false
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "now()",
                    isNullable: false
                },
                {
                    name: "last_login",
                    type: "timestamp",
                    isNullable: true
                },
                {
                    name: "avatar",
                    type: "text",
                    isNullable: true
                }
            ]
        }), true);

        // Roles table
        await queryRunner.createTable(new Table({
            name: "roles",
            columns: [
                {
                    name: "id",
                    type: "serial",
                    isPrimary: true
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "100",
                    isUnique: true,
                    isNullable: false
                },
                {
                    name: "description",
                    type: "text",
                    isNullable: true
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()",
                    isNullable: false
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "now()",
                    isNullable: false
                }
            ]
        }), true);

        // Permissions table
        await queryRunner.createTable(new Table({
            name: "permissions",
            columns: [
                {
                    name: "id",
                    type: "serial",
                    isPrimary: true
                },
                {
                    name: "code",
                    type: "varchar",
                    length: "100",
                    isUnique: true,
                    isNullable: false
                },
                {
                    name: "description",
                    type: "text",
                    isNullable: true
                },
                {
                    name: "service",
                    type: "varchar",
                    length: "100",
                    isNullable: false
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()",
                    isNullable: false
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "now()",
                    isNullable: false
                }
            ]
        }), true);

        // User Roles table
        await queryRunner.createTable(new Table({
            name: "user_roles",
            columns: [
                {
                    name: "user_id",
                    type: "uuid",
                    isPrimary: true
                },
                {
                    name: "role_id",
                    type: "integer",
                    isPrimary: true
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()",
                    isNullable: false
                }
            ]
        }), true);

        // Role Permissions table
        await queryRunner.createTable(new Table({
            name: "role_permissions",
            columns: [
                {
                    name: "role_id",
                    type: "integer",
                    isPrimary: true
                },
                {
                    name: "permission_id",
                    type: "integer",
                    isPrimary: true
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()",
                    isNullable: false
                }
            ]
        }), true);

        // Add foreign key constraints
        await queryRunner.createForeignKey("user_roles", new TableForeignKey({
            columnNames: ["user_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey("user_roles", new TableForeignKey({
            columnNames: ["role_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "roles",
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey("role_permissions", new TableForeignKey({
            columnNames: ["role_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "roles",
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey("role_permissions", new TableForeignKey({
            columnNames: ["permission_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "permissions",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("role_permissions");
        await queryRunner.dropTable("user_roles");
        await queryRunner.dropTable("permissions");
        await queryRunner.dropTable("roles");
        await queryRunner.dropTable("users");
    }
}