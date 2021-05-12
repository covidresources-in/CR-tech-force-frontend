import gql from "graphql-tag";

export const CREATE_TICKET = gql`
  mutation(
    $state: String
    $city: String
    $contactName: String
    $phoneNumber: String
    $resourceType: String
    $resourceSubtype: String
    $address: String
    $pincode: String
    $description: String
    $secretKey: String
  ) {
    createTicket(
      input: {
        state: $state
        city: $city
        contactName: $contactName
        phoneNumber: $phoneNumber
        resourceType: $resourceType
        resourceSubtype: $resourceSubtype
        address: $address
        pincode: $pincode
        description: $description
        secretKey: $secretKey
      }
    ) {
      status
      message
    }
  }
`;

export const FETCH_TICKET = gql`
query ($ticketId: String!) {
  workspace {
    tickets(ticketId: $ticketId) {
      edges {
        node {
          state
          city
          contactName
          phoneNumber
          resourceType
          resourceSubtype
          address
          pincode
          description
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
    $phoneNumber: String
    $resourceType: String
    $resourceSubtype: String
    $address: String
    $pincode: String
    $description: String
    $secretKey: String
    $updateTicketToken: String
  ) {
    createTicket(
      input: {
        state: $state
        city: $city
        contactName: $contactName
        phoneNumber: $phoneNumber
        resourceType: $resourceType
        resourceSubtype: $resourceSubtype
        address: $address
        pincode: $pincode
        description: $description
        secretKey: $secretKey
      }
    ) {
      status
      message
    }
  }
`;