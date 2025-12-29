import { Command } from './command.interface.js';
import { TSVFileReader } from '../..//shared/file-reader/index.js';
import { User, UserType } from '../../shared/types/index.js';
import chalk from 'chalk';
import { inspect } from 'node:util';


export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public users: User[] = [
    { name: 'name1', email: 'mail1@gmail.com', type: UserType.Pro, avatar: 'Avatar1.png' },
    { name: 'name1', email: 'mail2@gmail.com', type: UserType.Regular, avatar: 'Avatar2.png' }
  ];

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();
      const offers = fileReader.toArray(this.users);
  console.info(chalk.cyan(`Imported ${offers.length} offers from ${filename}`));
  console.log(inspect(offers, { colors: true, depth: null }));
    } catch (err) {

      if (!(err instanceof Error)) {
        throw err;
      }

      console.error(chalk.red(`Can't import data from file: ${filename}`));
      console.error(chalk.red(`Details: ${err.message}`));
    }
  }
}