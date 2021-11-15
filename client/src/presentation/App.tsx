import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Products, Product } from '../products';
import { theme } from './theme';

export const App = () => {

  return (
    <ThemeProvider
      theme={theme}
    >
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path='/'
          >
            <Redirect
              to='/products'
            />
          </Route>
          <Route
            path='/products/:productId'
            component={Product}
          />
          <Route
            exact
            path='/products'
            component={Products}
          />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
};
