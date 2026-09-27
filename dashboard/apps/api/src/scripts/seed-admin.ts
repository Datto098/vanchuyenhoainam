import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { UserRole } from '@auto-tags/shared-types';
import { AppModule } from '../app.module';
import { UsersService } from '../modules/users/users.service';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const config = app.get(ConfigService);
    const users = app.get(UsersService);
    const email = config.getOrThrow<string>('ADMIN_EMAIL');
    if (await users.findByEmailWithSecrets(email)) {
      process.stdout.write(`Admin ${email} already exists\n`);
      return;
    }
    await users.create({
      email,
      password: config.getOrThrow<string>('ADMIN_PASSWORD'),
      fullName: config.get<string>('ADMIN_FULL_NAME', 'System Administrator'),
      role: UserRole.ADMIN,
    });
    process.stdout.write(`Created admin ${email}\n`);
  } finally {
    await app.close();
  }
}

void main();
