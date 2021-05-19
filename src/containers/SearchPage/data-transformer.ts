import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import { SearchResultCardData } from "../../components/SearchResultsCard/types";
import { searchGraphQLNode } from './types';
dayjs.extend(relativeTime);

export const transformSearchDataToSearchResultCardData = (data: searchGraphQLNode): SearchResultCardData => {
    const {
        contactName, contactNumber, leadId, upvoteCount, 
        downvoteCount, updatedAt, state, city, address,
         pincode, description, resourceType, subResourceType 
        } = data;


    return {
        contactName,
        contactNumber,
        description,
        downvoteCount: Number(downvoteCount),
        id: leadId,
        lastVerified: getVerifiedText(updatedAt),
        resourceType,
        subResourceType,
        upvoteCount: Number(upvoteCount),
        address,
        city,
        state,
        pincode
    }
}

const getVerifiedText = (updatedAt: string) => {
    if (!Number.isNaN(updatedAt)) {
      return dayjs(Number(updatedAt)).fromNow();
    }

    return dayjs(updatedAt).fromNow();
  };