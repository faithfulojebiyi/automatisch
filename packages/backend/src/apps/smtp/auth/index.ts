import verifyCredentials from './verify-credentials';
import isStillVerified from './is-still-verified';

export default {
  fields: [
    {
      key: 'host',
      label: 'Host',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'The host information Automatisch will connect to.',
      docUrl: 'https://automatisch.io/docs/smtp#host',
      clickToCopy: false,
    },
    {
      key: 'username',
      label: 'Email/Username',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'Your SMTP login credentials.',
      docUrl: 'https://automatisch.io/docs/smtp#username',
      clickToCopy: false,
    },
    {
      key: 'password',
      label: 'Password',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: null,
      docUrl: 'https://automatisch.io/docs/smtp#password',
      clickToCopy: false,
    },
    {
      key: 'useTls',
      label: 'Use TLS?',
      type: 'dropdown',
      required: false,
      readOnly: false,
      value: false,
      placeholder: null,
      description: null,
      docUrl: 'https://automatisch.io/docs/smtp#use-tls',
      clickToCopy: false,
      options: [
        {
          label: 'Yes',
          value: true,
        },
        {
          label: 'No',
          value: false,
        },
      ],
    },
    {
      key: 'port',
      label: 'Port',
      type: 'string',
      required: false,
      readOnly: false,
      value: 25,
      placeholder: null,
      description: null,
      docUrl: 'https://automatisch.io/docs/smtp#port',
      clickToCopy: false,
    },
    {
      key: 'fromEmail',
      label: 'From Email',
      type: 'string',
      required: false,
      readOnly: false,
      value: null,
      placeholder: null,
      description: null,
      docUrl: 'https://automatisch.io/docs/smtp#from-email',
      clickToCopy: false,
    },
  ],
  authenticationSteps: [
    {
      step: 1,
      type: 'mutation',
      name: 'createConnection',
      arguments: [
        {
          name: 'key',
          value: '{key}',
        },
        {
          name: 'formattedData',
          value: null,
          properties: [
            {
              name: 'host',
              value: '{fields.host}',
            },
            {
              name: 'username',
              value: '{fields.username}',
            },
            {
              name: 'password',
              value: '{fields.password}',
            },
            {
              name: 'useTLS',
              value: '{fields.useTls}',
            },
            {
              name: 'port',
              value: '{fields.port}',
            },
            {
              name: 'fromEmail',
              value: '{fields.fromEmail}',
            },
          ],
        },
      ],
    },
    {
      step: 2,
      type: 'mutation',
      name: 'verifyConnection',
      arguments: [
        {
          name: 'id',
          value: '{createConnection.id}',
        },
      ],
    },
  ],
  reconnectionSteps: [
    {
      step: 1,
      type: 'mutation',
      name: 'resetConnection',
      arguments: [
        {
          name: 'id',
          value: '{connection.id}',
        },
      ],
    },
    {
      step: 2,
      type: 'mutation',
      name: 'updateConnection',
      arguments: [
        {
          name: 'id',
          value: '{connection.id}',
        },
        {
          name: 'formattedData',
          value: null,
          properties: [
            {
              name: 'host',
              value: '{fields.host}',
            },
            {
              name: 'username',
              value: '{fields.username}',
            },
            {
              name: 'password',
              value: '{fields.password}',
            },
            {
              name: 'useTLS',
              value: '{fields.useTls}',
            },
            {
              name: 'port',
              value: '{fields.port}',
            },
            {
              name: 'fromEmail',
              value: '{fields.fromEmail}',
            },
          ],
        },
      ],
    },
    {
      step: 3,
      type: 'mutation',
      name: 'verifyConnection',
      arguments: [
        {
          name: 'id',
          value: '{connection.id}',
        },
      ],
    },
  ],
  verifyCredentials,
  isStillVerified,
};
