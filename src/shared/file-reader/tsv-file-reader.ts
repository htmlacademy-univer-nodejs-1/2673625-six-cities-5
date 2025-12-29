import { createReadStream } from 'node:fs';
import readline from 'node:readline';
import { Offer } from '../types/index.js';
import { OfferFactory } from './factories/offer.factory.js';
import { User } from '../types/index.js';

export class TSVFileReader {
  constructor(private readonly filename: string) {}

  public async read(
    users: User[],
    onLine: (offer: Offer) => void
  ): Promise<void> {
    const stream = createReadStream(this.filename, {
      encoding: 'utf-8',
    });

    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      if (!line.trim()) {
        continue;
      }

      const parts = line.split('\t');

      if (parts.length !== 17) {
        continue;
      }

      const offer = OfferFactory.createFromTSV(parts, users);

      if (offer) {
        onLine(offer);
      }
    }
  }
}
