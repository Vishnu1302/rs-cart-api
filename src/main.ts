import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';
import helmet from 'helmet';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  console.log('step1');
  const app = await NestFactory.create(AppModule);
  console.log('step2');
  app.use(helmet());
  console.log('step3');
  await app.init();
  console.log('step4');
  const expressApp = app.getHttpAdapter().getInstance();
  console.log('step5');
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log('server start')
  server = server ?? (await bootstrap());
  console.log('server end')
  return server(event, context, callback);
};