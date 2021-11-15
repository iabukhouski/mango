import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Product } from '../products';
import { theme } from './theme';

export const App = () => {

  return (
    <ThemeProvider
      theme={theme}
    >
      <BrowserRouter>
        <Switch>
          <Route
            path='/products/:productId'
            component={Product}
          />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
};
