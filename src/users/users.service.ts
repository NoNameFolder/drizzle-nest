import { Inject, Injectable } from '@nestjs/common';
import * as sc from '../db/schema';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, eq, sql } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof sc>,
  ) {}

  async create() {
    const body: sc.NewUser = {
      email: 'test@test.ru',
      bio: 'Описание биографии',
    };
    await this.db.insert(sc.users).values(body);
  }

  async findAll() {
    return await this.db.select().from(sc.users);
  }
  async findOne() {
    const id = 1;
    return await this.db.execute(sql`select * from users where id=${id}`);
  }

  async update() {
    const id = 1;
    const body = {
      email: 'test2@test.ru',
    };
    await this.db.update(sc.users).set(body).where(eq(sc.users.id, id));
  }

  async remove() {
    const id = 1;
    await this.db.delete(sc.users).where(eq(sc.users.id, id));
  }
}
