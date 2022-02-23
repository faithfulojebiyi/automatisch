import { Command } from 'commander';
import createCommand from './commands/create';

const program = new Command('automatisch');

program.addCommand(createCommand);

program.parse(process.argv);
