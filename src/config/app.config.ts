import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: 'development',
  port: parseInt(process.env.PORT ?? '5000', 10),
}));
