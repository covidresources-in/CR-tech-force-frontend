import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import { SearchResultCardData } from "../../components/SearchResultsCard/types";
import { searchGraphQLNode } from './types';
dayjs.extend(relativeTime);

export const transformSearchDataToSearchResultCardData = (data: searchGraphQLNode): SearchResultCardData => {
    const {
        contactName, contactNumber, id, upvoteCount, 
        downvoteCount, updatedAt, state, city, address,
         pincode, description, resourceType, subResourceType 
        } = data;
    const location = `
    ${address},
    ${city}, ${state}
    ${pincode}
    `;


    return {
        contactName,
        contactNumber,
        description,
        downvoteCount: Number(downvoteCount),
        id,
        lastVerified: getVerifiedText(updatedAt),
        location,
        resourceType,
        subResourceType,
        upvoteCount: Number(upvoteCount)
    }
}

const getVerifiedText = (updatedAt: string) => {
    if (!Number.isNaN(updatedAt)) {
      return dayjs(Number(updatedAt)).fromNow();
    }

    return dayjs(updatedAt).fromNow();
  };