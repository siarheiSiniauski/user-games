import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnTokenUser1725531594709 implements MigrationInterface {
  name = 'AddColumnTokenUser1725531594709';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "token" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "token"`);
  }
}
