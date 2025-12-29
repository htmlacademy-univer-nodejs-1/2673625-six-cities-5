import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/file-reader/index.js';
import { User, UserType } from '../../shared/types/index.js';
import chalk from 'chalk';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public users: User[] = [
    { name: 'name1', email: 'mail1@gmail.com', type: UserType.Pro, avatar: 'Avatar1.png' },
    { name: 'name2', email: 'mail2@gmail.com', type: UserType.Regular, avatar: 'Avatar2.png' }
  ];

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    try {
      let count = 0;

      await fileReader.read(this.users, () => {
        count++;
        // позже тут будет сохранение в БД
      });

      console.info(chalk.green(`Imported ${count} offers from ${filename}`));
    } catch (err) {
      if (!(err instanceof Error)) {
        throw err;
      }

      console.error(chalk.red(`Can't import data from file: ${filename}`));
      console.error(chalk.red(`Details: ${err.message}`));
    }
  }
}
