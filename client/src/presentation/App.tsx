import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';

export const App = () => {

  return (
    <ThemeProvider
      theme={theme}
    >
    </ThemeProvider>
  );
};
