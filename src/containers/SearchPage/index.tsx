import { useLazyQuery } from '@apollo/client';
import { Button, Typography } from '@material-ui/core';
import gql from 'graphql-tag';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useHistory } from 'react-router';
import SearchBar from '../../components/SearchBar';
import SearchResultCard from '../../components/SearchResultsCard/SearchResultCard';
import ROUTES from '../../constants/routes';
import { Context as SearchContext } from '../../context/SearchContext';
import { logEvent } from "../../utils/gtag";
import { searchGraphQLNode } from './types';
import { transformSearchDataToSearchResultCardData } from './data-transformer';
import LazyLoad from 'react-lazyload';

const TIMEOUT_DEFAULT_TIME = 15;
const TWITTER_SOCIAL_HANDLE = 'https://twitter.com/COVResourcesIn'

const sortOnUpvoteCountBasis = (dataArray: any[]) => {
  const upVoteData = dataArray.filter(data => data.node.upvoteCount >= -3);
  const downVoteData = dataArray.filter(data => data.node.upvoteCount < -3);

  return [
    ...upVoteData,
    ...downVoteData
  ]
}

function SearchPage() {
  const { state } = useContext(SearchContext);

  const [currentData, setCurrentData] = useState([]);
  const [redirectToTwitter, setRedirectToTwitter] = useState(false)
  const [timeoutTime, setTimeoutTime] = useState(TIMEOUT_DEFAULT_TIME)
  const timeoutRef = useRef(0);
  const history = useHistory();

  if (timeoutTime === 0) {
    window.open(TWITTER_SOCIAL_HANDLE, '_self')
  }

  const getFilter = () => {
    let filter = ``;
    if (state?.searchInputs?.state) {
      filter += `state:"${state?.searchInputs?.state}", `;
    }

    if (state?.searchInputs?.city) {
      filter += `city:"${state?.searchInputs?.city}", `;
    }

    if (state?.searchInputs?.requirement) {
      filter += `resourceType:"${state?.searchInputs?.requirement}", `;
    }

    if (!filter) {
      filter += `resourceType:"Oxygen"`;
    }

    return filter
  }

  const [executeSearch, { loading, called }] = useLazyQuery(GET_SEARCH(getFilter()), {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      let finalData = data?.workspace?.tickets?.edges || [];
      if (finalData.length === 0) {
        enableRedirectionToSocialHandle();
      }
      finalData = sortOnUpvoteCountBasis(finalData)
      setCurrentData(finalData)
    }, onError: () => {
      enableRedirectionToSocialHandle();
      setCurrentData([]);
    },
  });

  const enableRedirectionToSocialHandle = useCallback(() => {
    setRedirectToTwitter(true)
    timeoutRef.current = window.setInterval(() => {
      setTimeoutTime(prevTime => prevTime - 1)
    }, 1000)
  }, [])

  const handleClose = () => {
    setRedirectToTwitter(false);
    window.clearInterval(timeoutRef.current);
    setTimeoutTime(TIMEOUT_DEFAULT_TIME);
  }

  useEffect(() => {
    if (history.location.search.includes('executeSearch')) {
      history.push(ROUTES.SEARCH);
      executeSearch();
    }
  }, [executeSearch, history])

  useEffect(() => {
    if (state?.searchInputs?.state && state?.searchInputs?.city && state?.searchInputs?.requirement) {
      executeSearch();
    }
  }, [state, executeSearch]);

  return (
    <div>
      <SearchBar onSubmit={() => {
        logEvent({
          action: 'submit_search',
          page_location: window.location.pathname,
          name: 'Search',
          value: `State - ${state?.searchInputs?.state}, City - ${state?.searchInputs?.city}, Requirement - ${state?.searchInputs?.requirement}`
        })
        handleClose();
        setCurrentData([]);
        executeSearch();
      }} />
      {state?.searchInputs && called && <>
        {loading && <div className="d-flex justify-content-center">
          <Loader
            type="ThreeDots"
            color="#4452CE"
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>}
        {redirectToTwitter &&
          <>
            <Typography variant="h6" className="mb-4">
              Sorry! We don't have any active leads for your search.<br />
            Redirecting you to <a href={TWITTER_SOCIAL_HANDLE}>our twitter handle</a> for live updates in {timeoutTime} seconds..
          </Typography>
            <Button variant="contained" onClick={handleClose} color="primary">
              Cancel Redirection
        </Button>
          </>
        }
        {currentData.length !== 0 && <>
          <Typography color="textSecondary" className="mb-4">Showing {currentData.length} Result{currentData.length > 1 ? 's' : ''}</Typography>
          <div className="d-flex flex-wrap">
            {currentData.map(((edgeData: {
              node: searchGraphQLNode
            }, index: number) =>
              <div
                className="col-12 col-md-6 col-lg-4 "
                key={index}
              >
                <LazyLoad>
                  <SearchResultCard
                    data={transformSearchDataToSearchResultCardData(edgeData.node)}
                    className="px-sm-4"
                    executeSearch={executeSearch}
                  />
                </LazyLoad>
              </div>
            ))}
          </div></>}
      </>}
    </div>
  );
}

const GET_SEARCH = (filter: any) => gql`
      query {
          workspace {
            tickets(${filter}) {
              edges {
                node {
                  updatedAt
                  resourceType
                  subResourceType
                  contactName
                  contactNumber
                  upvoteCount
                  downvoteCount
                  description
                  city
                  state
                  pincode
                  address
                  leadId
                }
              }
            }
          }
        }
      `;

export default SearchPage;
