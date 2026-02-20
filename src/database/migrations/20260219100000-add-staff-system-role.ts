import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStaffSystemRole20260219100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO roles (id, name, description)
      SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM roles), 'STAFF', 'Organization staff'
      WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'STAFF')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM roles WHERE name = 'STAFF'`);
  }
}
