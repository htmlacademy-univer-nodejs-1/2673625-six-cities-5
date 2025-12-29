import { Command } from './command.interface.js';
import axios from 'axios';
import { createWriteStream } from 'node:fs';
import chalk from 'chalk';
import { OfferGenerator } from '../../shared/offer-generator/offer-generator.js';
import { MockServerData } from '../../shared/types/Mock-server-data.js';

export class GenerateCommand implements Command {
  public getName(): string {
    return '--generate';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;

    const offerCount = Number(count);
    if (!offerCount || offerCount <= 0) {
      console.error(chalk.red('Invalid offer count'));
      return;
    }

    try {
      const response = await axios.get<MockServerData>(url);
      const generator = new OfferGenerator(response.data);


      const writeStream = createWriteStream(filepath, { encoding: 'utf-8' });

      for (let i = 0; i < offerCount; i++) {
        writeStream.write(generator.generate() + '\n');
      }

      writeStream.end();

      console.info(
        chalk.green(`Generated ${offerCount} offers into ${filepath}`)
      );
    } catch (error) {
      console.error(chalk.red('Failed to generate offers'));
      console.error(error);
    }
  }
}
