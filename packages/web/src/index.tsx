import React from 'react';
import ReactDOM from 'react-dom';
import ThemeProvider from 'components/ThemeProvider';
import IntlProvider from 'components/IntlProvider';
import ApolloProvider from 'components/ApolloProvider';
import SnackbarProvider from 'components/SnackbarProvider';
import { AuthenticationProvider } from 'contexts/Authentication';
import Router from 'components/Router';
import routes from 'routes';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <SnackbarProvider>
    <AuthenticationProvider>
      <ApolloProvider>
        <IntlProvider>
          <ThemeProvider>
            <Router>
              {routes}
            </Router>
          </ThemeProvider>
        </IntlProvider>
      </ApolloProvider>
    </AuthenticationProvider>
  </SnackbarProvider>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
