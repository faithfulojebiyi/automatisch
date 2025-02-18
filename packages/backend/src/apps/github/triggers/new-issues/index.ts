import defineTrigger from '../../../../helpers/define-trigger';
import newIssues from './new-issues';

export default defineTrigger({
  name: 'New issue',
  key: 'newIssues',
  pollInterval: 15,
  description: 'Triggers when a new issue is created',
  substeps: [
    {
      key: 'chooseConnection',
      name: 'Choose connection',
    },
    {
      key: 'chooseTrigger',
      name: 'Set up a trigger',
      arguments: [
        {
          label: 'Repo',
          key: 'repo',
          type: 'dropdown',
          required: false,
          variables: false,
          source: {
            type: 'query',
            name: 'getData',
            arguments: [
              {
                name: 'key',
                value: 'listRepos',
              },
            ],
          },
        },
        {
          label: 'Which types of issues should this trigger on?',
          key: 'issueType',
          type: 'dropdown',
          description: 'Defaults to any issue you can see.',
          required: true,
          variables: false,
          value: 'all',
          options: [
            {
              label: 'Any issue you can see',
              value: 'all',
            },
            {
              label: 'Only issues assigned to you',
              value: 'assigned',
            },
            {
              label: 'Only issues created by you',
              value: 'created',
            },
            {
              label: `Only issues you're mentioned in`,
              value: 'mentioned',
            },
            {
              label: `Only issues you're subscribed to`,
              value: 'subscribed',
            },
          ],
        },
        {
          label: 'Label',
          key: 'label',
          type: 'dropdown',
          description: 'Only trigger on issues when this label is added.',
          required: false,
          variables: false,
          dependsOn: ['parameters.repo'],
          source: {
            type: 'query',
            name: 'getData',
            arguments: [
              {
                name: 'key',
                value: 'listLabels',
              },
              {
                name: 'parameters.repo',
                value: '{parameters.repo}',
              },
            ],
          },
        },
      ],
    },
    {
      key: 'testStep',
      name: 'Test trigger',
    },
  ],

  async run($) {
    await newIssues($);
  },
});
