import { describe, expect, it } from 'vitest';
import { Engine, type Middleware } from './Engine';

describe('Engine test', () => {
  it('use and execute synchronous middleware', async () => {
    type Context = {
      count: number;
    };

    const engine = new Engine<Context>();

    const inc: Middleware<Context> = async (context, next) => {
      console.log('Inc middleware');
      context.count += 5;
      next();
    };

    const dec: Middleware<Context> = async (context, next) => {
      console.log('Dec middleware');
      context.count -= 1;
      next();
    };

    engine.use(inc);
    engine.use(dec);

    const context: Context = {
      count: 0,
    };
    engine.execute(context);
    expect(context.count).toBe(4);
  });

  it('use and execute async middleware', async () => {
    type Context = {
      count: 0;
    };
    const engine = new Engine<Context>();
    const asyncInc: Middleware<Context> = async (context, next) => {
      await new Promise((resolve) => {
        setTimeout(() => {
          context.count += 10;
          resolve(context.count);
        }, 0);
      });
      return await next();
    };
    const asyncDec: Middleware<Context> = async (context, next) => {
      await new Promise((resolve) => {
        setTimeout(() => {
          context.count -= 1;
          resolve(context.count);
        }, 0);
      });
      return await next();
    };

    engine.use(asyncInc);
    engine.use(asyncDec);

    const context: Context = {
      count: 0,
    };
    await engine.executeAsync(context);
    expect(context.count).toBe(9);
  });
});
