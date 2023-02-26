export type Middleware<T> = (context: T, next: () => Promise<void>) => Promise<void>;

export class Engine<T> {
  private middlewares: Middleware<T>[] = [];
  use(middleware: Middleware<T>) {
    this.middlewares.push(middleware);
  }

  execute(context: T) {
    const runMiddeware = async (index: number) => {
      if (index >= this.middlewares.length) return;
      try {
        this.middlewares[index](context, () => runMiddeware(index + 1));
      } catch (error) {
        console.log('Error occured');
        throw error;
      }
    };
    runMiddeware(0);
  }

  async executeAsync(context: T) {
    const runMiddeware = async (index: number) => {
      if (index >= this.middlewares.length) return;
      try {
        const middleware = this.middlewares[index];
        if (middleware.constructor.name === 'AsyncFunction') {
          await middleware(context, async () => await runMiddeware(index + 1));
        } else {
          await middleware(context, () => runMiddeware(index + 1));
        }
      } catch (error) {
        console.error('Error');
        throw error;
      }
    };
    await runMiddeware(0);
  }
}
