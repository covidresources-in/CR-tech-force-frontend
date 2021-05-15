import { gql, useMutation } from "@apollo/client";
import {
  Badge,
  Button,
  Card,
  Divider,
  IconButton,
  makeStyles,
  Snackbar,
  Typography,
  withTheme,
} from "@material-ui/core";
import ThumbDownAltIcon from "@material-ui/icons/ThumbDownAlt";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useCallback, useEffect, useState } from "react";
import CopyButton from "../../global/assets/icons/copy.svg";
import GreenTick from "../GreenTick/GreenTick";
import { SearchResultCardData } from "./types";
dayjs.extend(relativeTime);

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "1.5rem",
  },
  root: {
    minWidth: theme.spacing(37.25),
    border: "1px solid #DDD",
  },
  cardHeader: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(1.5, 2.0, 0.625),
    background: "#4556CA",
    color: "#fff",
    borderRadius: "5px",
    margin: "4px",
  },
  cardTitle: {
    lineHeight: "23.6px",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    background: "#fff",
    color: "#8F8F8F",
    position: "relative",
  },
  cardFooter: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    background: "#FAFAFA",
    color: "#777",
  },
  thumbsUp: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    marginLeft: theme.spacing(5),
  },
  thumbsDown: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    marginLeft: theme.spacing(2.5),
  },
  downBadge: {
    marginTop: theme.spacing(-1),
    marginRight: theme.spacing(-1),
    color: "#fff",
    backgroundColor: "#ff5656",
  },
  upBadge: {
    marginTop: theme.spacing(-1),
    marginRight: theme.spacing(-1),
    color: "#fff",
    backgroundColor: "#46b33c;",
  },
  blackText: {
    fontSize: "1.1em",
    color: "#111",
  },
}));

const UPVOTE_COUNT = gql`
  mutation ($id: String) {
    upvoteTicket(input: { id: $id }) {
      status
      message
    }
  }
`;

const DOWNVOTE_COUNT = gql`
  mutation ($id: String) {
    downvoteTicket(input: { id: $id }) {
      status
      message
    }
  }
`;

interface Props {
  data: SearchResultCardData;
  className: string;
}

const SearchResultCard = (props: Props) => {
  const classes = useStyles();

  const {
    contactName, contactNumber, description, downvoteCount,
    id, lastVerified, location, resourceType, subResourceType,
    upvoteCount
  } = props.data;

  let allVotes = JSON.parse(localStorage.getItem("voted"));
  const [voted, setVoted] = useState(allVotes);
  const [upvote, setUpvote] = useState(upvoteCount);
  const [downvote, setDownvote] = useState(downvoteCount);

  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const [upvoteTicket] = useMutation(UPVOTE_COUNT, {
    variables: {
      id,
    },
    update(proxy, result) {
      if (
        result &&
        result.data &&
        result.data.upvoteTicket &&
        result.data.upvoteTicket.status === "200"
      ) {
        setUpvote(upvote + 1);
      } else {
        setDialogMessage("Please try again later.");
        setDialogOpen(true);
      }
    },
    onError(err) {
      console.log(err);
      setDialogMessage("Please try again later.");
      setDialogOpen(true);
    },
  });

  const [downvoteTicket] = useMutation(DOWNVOTE_COUNT, {
    variables: {
      id,
    },
    update(proxy, result) {
      if (
        result &&
        result.data &&
        result.data.downvoteTicket &&
        result.data.downvoteTicket.status === "200"
      ) {
        setDownvote(downvote + 1);
      } else {
        setDialogMessage("Please try again later.");
        setDialogOpen(true);
      }
    },
    onError(err) {
      console.log(err);
      setDialogMessage("Please try again later.");
      setDialogOpen(true);
    },
  });

  const handleTicketVoteClick = useCallback(
    (vote) => {
      let voteUpdateBy = 1;

      let votedFor = localStorage.getItem("voted");
      if (votedFor) {
        votedFor = JSON.parse(votedFor);
        if (votedFor[id]) {
          if (votedFor[id] === vote) {
            vote = vote === "up" ? "down" : "up";
          } else {
            voteUpdateBy = 2;
          }
          delete votedFor[id];
        } else {
          votedFor[id] = vote;
        }
      } else {
        votedFor = {};
        votedFor[id] = vote;
      }

      if (voteUpdateBy === 2) {
        localStorage.setItem(`voteUpdateBy-${id}`, 2);
        localStorage.setItem(`currentVote-${id}`, vote);
      }

      setVoted(votedFor);
      localStorage.setItem("voted", JSON.stringify(votedFor));
      vote === "up" ? upvoteTicket() : downvoteTicket();
    },
    [upvoteTicket, downvoteTicket, id]
  );

  useEffect(() => {
    let voteUpdateBy = parseInt(
      localStorage.getItem(`voteUpdateBy-${id}`)
    );
    let currentVote = localStorage.getItem(`currentVote-${id}`);

    if (voteUpdateBy === 2 && currentVote) {
      handleTicketVoteClick(currentVote === "up" ? "up" : "down");
      localStorage.removeItem(`voteUpdateBy-${id}`);
      localStorage.removeItem(`currentVote-${id}`);
    }
  }, [upvote, id, handleTicketVoteClick]);

  const getInfoToCopy = () => {
    const subResourceText = subResourceType ? `/${subResourceType}` : "";
    const resourceLeadText = resourceType ? `${resourceType}${subResourceText} lead information` : "";
    const lastVerifiedText = lastVerified ? `Last Verified : ${lastVerified}` : "";
    const contactNameText = contactName ? `Contact Name : ${contactName}` : '';
    const contactNumberText = contactNumber ? `Contact Number : ${contactNumber}` : "";
    const locationText = location ? `Location : ${location}` : "";
    const descriptionText = description ? `Description : ${description}` : "";

    const copyText = `${resourceLeadText}
    ${lastVerifiedText}
    ${contactNameText}
    ${contactNumberText}
    ${locationText}
    ${descriptionText}
    
    To find more such covid related information leads, visit: ${window.location.origin
      }`;

    return copyText;
  };

  const shareInfo = () => {
    const copyText = getInfoToCopy();

    if (navigator.share) {
      navigator
        .share({
          title: `${resourceType} Lead`,
          text: copyText,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    }
  };

  return (
    <div className={`${classes.container} ${props.className || ""}`}>
      <Card variant="outlined" className={classes.root}>
        <div className={classes.cardHeader}>
          <div className="py-2 d-flex">
            <div className="flex-grow-1">
              <div className="d-flex align-items-center">
                <Typography className="mr-2" variant="h6">
                  {resourceType} / {subResourceType}
                </Typography>
              </div>
              <div className="d-flex">
                <GreenTick />
                <Typography variant="caption" style={{ opacity: 0.7 }}>
                  Last verified {lastVerified}
                </Typography>
              </div>
            </div>

            {navigator.share && (
              <div>
                <Button
                  style={{
                    height: "fit-content",
                    textTransform: "capitalize",
                    fontSize: "0.8em",
                  }}
                  onClick={() => shareInfo()}
                  color="secondary"
                  variant="outlined"
                >
                  <img
                    src={CopyButton}
                    alt={"Copy"}
                    style={{ width: "20px", marginRight: "5px" }}
                  />
                  Share
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className={classes.cardContent}>
          <div className="d-flex flex-column p-3">
            <div className="flex-grow-1 mb-4">
              <Typography variant="body2">Contact Name</Typography>
              <Typography variant="body1" className={classes.blackText}>
                {contactName || "-"}
              </Typography>
            </div>

            <div className="flex-grow-1 mb-4">
              <Typography variant="body2">Contact Number</Typography>
              <Typography variant="body1">
                {contactNumber.trim().split(" ").map(number =>
                  <a className="mr-2" href={`tel:${number}`}>{number}</a>
                )}
              </Typography>
            </div>

            <div className="flex-grow-1 mb-2">
              <Typography variant="body2">Location</Typography>
              <Typography variant="body1" className={classes.blackText}>
                {location || "-"}
              </Typography>
            </div>

            <Divider className="my-3" />

            <div className="flex-grow-1">
              <Typography variant="body2">Description</Typography>
              <Typography variant="body1" className={classes.blackText}>
                {description || "-"}
              </Typography>
            </div>
          </div>
        </div>

        <div className={classes.cardFooter}>
          <div className="d-flex flex-row p-3">
            <Typography
              style={{ opacity: 0.7, width: "80%", padding: "10px" }}
              variant="body2"
            >
              Was this helpful?
            </Typography>

            <div className="d-flex flex-row">
              <div className={classes.thumbsUp}>
                <IconButton
                  onClick={() => handleTicketVoteClick("up")}
                  style={{
                    color:
                      voted && voted[id] === "up" ? "#2AA174" : "#CCC",
                    border: "1px solid #ccc",
                  }}
                >
                  <Badge
                    classes={{ badge: classes.upBadge }}
                    badgeContent={upvote > 0 ? upvote : null}
                  >
                    <ThumbUpAltIcon />
                  </Badge>
                </IconButton>
              </div>
              <div className={classes.thumbsDown}>
                <IconButton
                  onClick={() => handleTicketVoteClick("down")}
                  style={{
                    color:
                      voted && voted[id] === "down" ? "#E94235" : "#CCC",
                    border: "1px solid #ccc",
                  }}
                >
                  <Badge
                    classes={{ badge: classes.downBadge }}
                    badgeContent={upvote < 0 ? upvote : null}
                  >
                    <ThumbDownAltIcon />
                  </Badge>
                </IconButton>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={dialogOpen}
        autoHideDuration={2000}
        onClose={() => setDialogOpen(false)}
        message={dialogMessage}
      />
    </div >
  );
};

export default withTheme(SearchResultCard);
