import { Command } from 'commander';
import { prompt } from 'enquirer';

import infoSchema from '../templates/info.json';

const create = new Command('create');

create
  .command('integration')
  .action(async() => {
    const questions2 = [
      {
        type: 'input',
        name: 'first',
        initial: '',
        message: 'Please enter your first name',
      },
      {
        type: 'input',
        name: 'last',
        message() {
          return `Hi ${this.state.answers.first}! Please enter your last name`;
        }
      },
      {
        type: 'multiselect',
        name: 'color',
        message: 'Pick your favorite colors',
        limit: 7,
        choices: [
          { name: 'aqua', value: '#00ffff' },
          { name: 'black', value: '#000000' },
          { name: 'blue', value: '#0000ff' },
          { name: 'fuchsia', value: '#ff00ff' },
          { name: 'gray', value: '#808080' },
          { name: 'green', value: '#008000' },
          { name: 'lime', value: '#00ff00' },
          { name: 'maroon', value: '#800000' },
          { name: 'navy', value: '#000080' },
          { name: 'olive', value: '#808000' },
          { name: 'purple', value: '#800080' },
          { name: 'red', value: '#ff0000' },
          { name: 'silver', value: '#c0c0c0' },
          { name: 'teal', value: '#008080' },
          { name: 'white', value: '#ffffff' },
          { name: 'yellow', value: '#ffff00' }
        ]
      },
      {
        type: 'input',
        name: 'age',
        message() {
          return `How old are you?`;
        }
      }
    ];

    const questions: any = Object.entries(infoSchema.properties).map(([key, value]) => {
      const { type, items } = value as {  type: string, items?: any };

      if (type === 'array') return;

      return {
        type: 'input',
        name: key,
      };
    }).filter(Boolean);

    const answers: any = await prompt(questions);

    console.log('answers', answers);
  });

export default create;
