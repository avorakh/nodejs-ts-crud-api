export class InMemoryDb<T> {
  private store: Record<string, T> = {};

  async createOrUpdate(id: string, item: T): Promise<void> {
    this.store[id] = item;
  }

  async read(id: string): Promise<T | undefined> {
    return this.store[id];
  }

  async readAll(): Promise<T[]> {
    return Object.values(this.store);
  }

  async delete(id: string): Promise<void> {
    delete this.store[id];
  }
}
