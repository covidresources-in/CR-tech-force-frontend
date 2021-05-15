import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import ApolloLinkTimeout from 'apollo-link-timeout';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';
import SocialLinks from './components/SocialLinks';
import Home from './containers';
import AddEditResource from './containers/add-edit-resource';
import DataPartnerPage from './containers/DataPartner';
import SearchPage from './containers/SearchPage';
import VolunteerPage from './containers/Volunteer';
import { Provider as SearchProvider } from './context/SearchContext';
import './global/styles/common.scss';

export const VERIFIED_LEAD_PAGE_ROUTE = '/submit-a-verified-lead';

const timeoutLink = new ApolloLinkTimeout(15000);
const httpLink = createHttpLink({
  uri: 'https://re970lobb9.execute-api.ap-south-1.amazonaws.com/mongoDB/graphql'
})

const timeoutHttpLink = timeoutLink.concat(httpLink);
const client = new ApolloClient({
  link: timeoutHttpLink,
  cache: new InMemoryCache()
})
const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#4452CE',
      main: '#4452CE',
      dark: '#6744CC',
      contrastText: '#fff',
    },
    secondary: {
      light: '#fff',
      main: '#fff',
      dark: '#fff',
      contrastText: '#000',
    }
  },
  overrides: {
    MuiCard: {
      root: {
        boxShadow: 'none',
        borderRadius: '8px',
      }
    },
    MuiTypography: {
      h6: {
        fontSize: '18px',
      },
      subtitle2: {
        fontSize: '12px',
      }
    }
  }
});

function App() {

  return (
    <ApolloProvider client={client}>
      <SearchProvider>
        <ThemeProvider theme={theme}>
          <div className="App">
            <BrowserRouter>
              <ScrollToTop />
              <ThemeProvider theme={theme}>
                <Header />
                <div className="container">
                  <Switch>
                    <Route exact path="/submit-a-lead" component={AddEditResource} />
                    <Route exact path="/update-a-lead" component={AddEditResource} />
                    <Route exact path={VERIFIED_LEAD_PAGE_ROUTE} component={AddEditResource} />
                    <Route exact path="/home" component={Home} />
                    <Route exact path="/search" component={SearchPage} />
                    <Route exact path="/" component={Home} />
                    <Route exact path="/volunteer" component={VolunteerPage} />
                    <Route exact path="/dataPartner" component={DataPartnerPage} />
                  </Switch>
                </div>
                <Footer />
                <SocialLinks />
              </ThemeProvider>
            </BrowserRouter>
          </div>
        </ThemeProvider>
      </SearchProvider>
    </ApolloProvider>
  )
}

export default App
