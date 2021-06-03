import gql from "graphql-tag";

export const CREATE_TICKET = gql`
  mutation(
    $state: String
    $city: String
    $contactName: String
    $contactNumber: String
    $resourceType: String
    $subResourceType: String
    $address: String
    $pincode: String
    $description: String
    $status: String
  ) {
    createTicket(
      input: {
        state: $state
        city: $city
        contactName: $contactName
        contactNumber: $contactNumber
        resourceType: $resourceType
        subResourceType: $subResourceType
        address: $address
        pincode: $pincode
        description: $description
        status: $status
      }
    ) {
      status
      message
    }
  }
`;

export const FETCH_TICKET = gql`
query ($uuid: String!) {
  workspace {
    tickets(uuid: $uuid) {
      edges {
        node {
          state
          city
          contactName
          contactNumber
          resourceType
          subResourceType
          address
          pincode
          description
          leadId
        }
      }
    }
  }
}
`;

export const UPDATE_TICKET = gql`
  mutation(
    $state: String
    $city: String
    $contactName: String
    $contactNumber: String
    $resourceType: String
    $subResourceType: String
    $address: String
    $pincode: String
    $description: String
    $status: String
    $leadId: String
  ) {
    updateTicket(
      input: {
        state: $state
        city: $city
        contactName: $contactName
        contactNumber: $contactNumber
        resourceType: $resourceType
        subResourceType: $subResourceType
        address: $address
        pincode: $pincode
        description: $description
        status: $status
        leadId: $leadId
      }
    ) {
      status
      message
    }
  }
`;