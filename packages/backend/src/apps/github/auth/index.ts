import createAuthData from './create-auth-data';
import verifyCredentials from './verify-credentials';
import isStillVerified from './is-still-verified';

export default {
  fields: [
    {
      key: 'oAuthRedirectUrl',
      label: 'OAuth Redirect URL',
      type: 'string',
      required: true,
      readOnly: true,
      value: '{WEB_APP_URL}/app/github/connections/add',
      placeholder: null,
      description: 'When asked to input an OAuth callback or redirect URL in Github OAuth, enter the URL above.',
      docUrl: 'https://automatisch.io/docs/github#oauth-redirect-url',
      clickToCopy: true
    },
    {
      key: 'consumerKey',
      label: 'Client ID',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: null,
      docUrl: 'https://automatisch.io/docs/github#client-id',
      clickToCopy: false
    },
    {
      key: 'consumerSecret',
      label: 'Client Secret',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: null,
      docUrl: 'https://automatisch.io/docs/github#client-secret',
      clickToCopy: false
    }
  ],
  authenticationSteps: [
    {
      step: 1,
      type: 'mutation',
      name: 'createConnection',
      arguments: [
        {
          name: 'key',
          value: '{key}'
        },
        {
          name: 'formattedData',
          value: null,
          properties: [
            {
              name: 'consumerKey',
              value: '{fields.consumerKey}'
            },
            {
              name: 'consumerSecret',
              value: '{fields.consumerSecret}'
            }
          ]
        }
      ]
    },
    {
      step: 2,
      type: 'mutation',
      name: 'createAuthData',
      arguments: [
        {
          name: 'id',
          value: '{createConnection.id}'
        }
      ]
    },
    {
      step: 3,
      type: 'openWithPopup',
      name: 'openAuthPopup',
      arguments: [
        {
          name: 'url',
          value: '{createAuthData.url}'
        }
      ]
    },
    {
      step: 4,
      type: 'mutation',
      name: 'updateConnection',
      arguments: [
        {
          name: 'id',
          value: '{createConnection.id}'
        },
        {
          name: 'formattedData',
          value: null,
          properties: [
            {
              name: 'oauthVerifier',
              value: '{openAuthPopup.code}'
            }
          ]
        }
      ]
    },
    {
      step: 5,
      type: 'mutation',
      name: 'verifyConnection',
      arguments: [
        {
          name: 'id',
          value: '{createConnection.id}'
        }
      ]
    }
  ],
  reconnectionSteps: [
    {
      step: 1,
      type: 'mutation',
      name: 'resetConnection',
      arguments: [
        {
          name: 'id',
          value: '{connection.id}'
        }
      ]
    },
    {
      step: 2,
      type: 'mutation',
      name: 'updateConnection',
      arguments: [
        {
          name: 'id',
          value: '{connection.id}'
        },
        {
          name: 'formattedData',
          value: null,
          properties: [
            {
              name: 'consumerKey',
              value: '{fields.consumerKey}'
            },
            {
              name: 'consumerSecret',
              value: '{fields.consumerSecret}'
            }
          ]
        }
      ]
    },
    {
      step: 3,
      type: 'mutation',
      name: 'createAuthData',
      arguments: [
        {
          name: 'id',
          value: '{connection.id}'
        }
      ]
    },
    {
      step: 4,
      type: 'openWithPopup',
      name: 'openAuthPopup',
      arguments: [
        {
          name: 'url',
          value: '{createAuthData.url}'
        }
      ]
    },
    {
      step: 5,
      type: 'mutation',
      name: 'updateConnection',
      arguments: [
        {
          name: 'id',
          value: '{connection.id}'
        },
        {
          name: 'formattedData',
          value: null,
          properties: [
            {
              name: 'oauthVerifier',
              value: '{openAuthPopup.code}'
            }
          ]
        }
      ]
    },
    {
      step: 6,
      type: 'mutation',
      name: 'verifyConnection',
      arguments: [
        {
          name: 'id',
          value: '{connection.id}'
        }
      ]
    }
  ],

  createAuthData,
  verifyCredentials,
  isStillVerified,
};
