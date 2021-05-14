import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  useMutation,
} from "@apollo/client";
import {
  IconButton,
  makeStyles,
  MenuItem,
  TextField,
  Typography,
  withTheme,
  LinearProgress,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Alert, Autocomplete } from "@material-ui/lab";
import ApolloLinkTimeout from "apollo-link-timeout";
import gql from "graphql-tag";
import React, { useState } from "react";
import { useLocation } from "react-router";
import { VERIFIED_LEAD_PAGE_ROUTE } from "../../App";
import Button from "../../components/Button";

const timeoutLink = new ApolloLinkTimeout(15000);
const httpLink = createHttpLink({
  uri: "https://n512g51k1l.execute-api.ap-south-1.amazonaws.com/prod/graphql",
});

const timeoutHttpLink = timeoutLink.concat(httpLink);
const apolloClient = new ApolloClient({
  link: timeoutHttpLink,
  cache: new InMemoryCache(),
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  headingRoot: {
    background: theme.palette.primary.main,
    width: "100%",
    padding: theme.spacing(4.75, 5.5, 10.25),
    display: "flex",
    flexDirection: "column",
    color: "#fff",
    alignItems: "center",
    textAlign: "center",
  },
  formRoot: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "418px",
    width: "100%",
    marginTop: theme.spacing(7),

    "& > *": {
      marginBottom: theme.spacing(2),
    },
    alignItems: "center",
  },
}));

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra And Nagar Haveli (Union Territory)",
  "Daman And Diu (Union Territory)",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu And Kashmir (Union Territory)",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Nagaland",
  "Odisha",
  "Pondicherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const cities = {
  "Andhra Pradesh": [
    "Adoni",
    "Amaravati",
    "Anantapur",
    "Chandragiri",
    "Chittoor",
    "Dowlaiswaram",
    "Eluru",
    "Guntur",
    "Kadapa",
    "Kakinada",
    "Kurnool",
    "Machilipatnam",
    "Nagarjunakoṇḍa",
    "Rajahmundry",
    "Srikakulam",
    "Tirupati",
    "Vijayawada",
    "Visakhapatnam",
    "Vizianagaram",
    "Yemmiganur",
  ],
  "Arunachal Pradesh": ["Itanagar"],
  Assam: [
    "Dhuburi",
    "Dibrugarh",
    "Dispur",
    "Guwahati",
    "Jorhat",
    "Nagaon",
    "Sibsagar",
    "Silchar",
    "Tezpur",
    "Tinsukia",
  ],
  Bihar: [
    "Ara",
    "Baruni",
    "Begusarai",
    "Bettiah",
    "Bhagalpur",
    "Bihar Sharif",
    "Bodh Gaya",
    "Buxar",
    "Chapra",
    "Darbhanga",
    "Dehri",
    "Dinapur Nizamat",
    "Gaya",
    "Hajipur",
    "Jamalpur",
    "Katihar",
    "Madhubani",
    "Motihari",
    "Munger",
    "Muzaffarpur",
    "Patna",
    "Purnia",
    "Pusa",
    "Saharsa",
    "Samastipur",
    "Sasaram",
    "Sitamarhi",
    "Siwan",
  ],
  Chandigarh: ["Chandigarh"],
  Chhattisgarh: [
    "Ambikapur",
    "Bhilai",
    "Bilaspur",
    "Dhamtari",
    "Durg",
    "Jagdalpur",
    "Raipur",
    "Rajnandgaon",
  ],
  "Dadra And Nagar Haveli (Union Territory)": ["Silvassa"],
  "Daman And Diu (Union Territory)": ["Daman", "Diu"],
  Delhi: ["Delhi"],
  Goa: ["Madgaon", "Panaji"],
  Gujarat: [
    "Ahmadabad",
    "Amreli",
    "Bharuch",
    "Bhavnagar",
    "Bhuj",
    "Dwarka",
    "Gandhinagar",
    "Godhra",
    "Jamnagar",
    "Junagadh",
    "Kandla",
    "Khambhat",
    "Kheda",
    "Mahesana",
    "Morvi",
    "Nadiad",
    "Navsari",
    "Okha",
    "Palanpur",
    "Patan",
    "Porbandar",
    "Rajkot",
    "Surat",
    "Surendranagar",
    "Valsad",
    "Veraval",
  ],
  Haryana: [
    "Ambala",
    "Bhiwani",
    "Chandigarh",
    "Faridabad",
    "Firozpur Jhirka",
    "Gurgaon",
    "Hansi",
    "Hisar",
    "Jind",
    "Kaithal",
    "Karnal",
    "Kurukshetra",
    "Panipat",
    "Pehowa",
    "Rewari",
    "Rohtak",
    "Sirsa",
    "Sonipat",
  ],
  "Himachal Pradesh": [
    "Bilaspur",
    "Chamba",
    "Dalhousie",
    "Dharmshala",
    "Hamirpur",
    "Kangra",
    "Kullu",
    "Mandi",
    "Nahan",
    "Shimla",
    "Una",
  ],
  "Jammu And Kashmir (Union Territory)": [
    "Anantnag",
    "Baramula",
    "Doda",
    "Gulmarg",
    "Jammu",
    "Kathua",
    "Punch",
    "Rajauri",
    "Srinagar",
    "Udhampur",
  ],
  Jharkhand: [
    "Bokaro",
    "Chaibasa",
    "Deoghar",
    "Dhanbad",
    "Dumka",
    "Giridih",
    "Hazaribag",
    "Jamshedpur",
    "Jharia",
    "Rajmahal",
    "Ranchi",
    "Saraikela",
  ],
  Karnataka: [
    "Badami",
    "Ballari",
    "Bangalore",
    "Belgavi",
    "Bhadravati",
    "Bidar",
    "Chikkamagaluru",
    "Chitradurga",
    "Davangere",
    "Halebid",
    "Hassan",
    "Hubballi-Dharwad",
    "Kalaburagi",
    "Kolar",
    "Madikeri",
    "Mandya",
    "Mangaluru",
    "Mysuru",
    "Raichur",
    "Shivamogga",
    "Shravanabelagola",
    "Shrirangapattana",
    "Tumkuru",
  ],
  Kerala: [
    "Alappuzha",
    "Badagara",
    "Idukki",
    "Kannur",
    "Kochi",
    "Kollam",
    "Kottayam",
    "Kozhikode",
    "Mattancheri",
    "Palakkad",
    "Thalassery",
    "Thiruvananthapuram",
    "Thrissur",
  ],
  Ladakh: ["Kargil", "Leh"],
  "Madhya Pradesh": [
    "Balaghat",
    "Barwani",
    "Betul",
    "Bharhut",
    "Bhind",
    "Bhojpur",
    "Bhopal",
    "Burhanpur",
    "Chhatarpur",
    "Chhindwara",
    "Damoh",
    "Datia",
    "Dewas",
    "Dhar",
    "Guna",
    "Gwalior",
    "Hoshangabad",
    "Indore",
    "Itarsi",
    "Jabalpur",
    "Jhabua",
    "Khajuraho",
    "Khandwa",
    "Khargon",
    "Maheshwar",
    "Mandla",
    "Mandsaur",
    "Mhow",
    "Morena",
    "Murwara",
    "Narsimhapur",
    "Narsinghgarh",
    "Narwar",
    "Neemuch",
    "Nowgong",
    "Orchha",
    "Panna",
    "Raisen",
    "Rajgarh",
    "Ratlam",
    "Rewa",
    "Sagar",
    "Sarangpur",
    "Satna",
    "Sehore",
    "Seoni",
    "Shahdol",
    "Shajapur",
    "Sheopur",
    "Shivpuri",
    "Ujjain",
    "Vidisha",
  ],
  Maharashtra: [
    "Ahmadnagar",
    "Akola",
    "Amravati",
    "Aurangabad",
    "Bhandara",
    "Bhusawal",
    "Bid",
    "Buldana",
    "Chandrapur",
    "Daulatabad",
    "Dhule",
    "Jalgaon",
    "Kalyan",
    "Karli",
    "Kolhapur",
    "Mahabaleshwar",
    "Malegaon",
    "Matheran",
    "Mumbai",
    "Nagpur",
    "Nanded",
    "Nashik",
    "Osmanabad",
    "Pandharpur",
    "Parbhani",
    "Pune",
    "Ratnagiri",
    "Sangli",
    "Satara",
    "Sevagram",
    "Solapur",
    "Thane",
    "Ulhasnagar",
    "Vasai-Virar",
    "Wardha",
    "Yavatmal",
  ],
  Manipur: ["Imphal"],
  Meghalaya: ["Cherrapunji", "Shillong", "Mizoram", "Aizawl", "Lunglei"],
  Nagaland: ["Kohima", "Mon", "Phek", "Wokha", "Zunheboto"],
  Odisha: [
    "Balangir",
    "Baleshwar",
    "Baripada",
    "Bhubaneshwar",
    "Brahmapur",
    "Cuttack",
    "Dhenkanal",
    "Keonjhar",
    "Konark",
    "Koraput",
    "Paradip",
    "Phulabani",
    "Puri",
    "Sambalpur",
    "Udayagiri",
  ],
  Pondicherry: ["Karaikal", "Mahe", "Pondicherry", "Yanam"],
  Punjab: [
    "Amritsar",
    "Batala",
    "Chandigarh",
    "Faridkot",
    "Firozpur",
    "Gurdaspur",
    "Hoshiarpur",
    "Jalandhar",
    "Kapurthala",
    "Ludhiana",
    "Nabha",
    "Patiala",
    "Rupnagar",
    "Sangrur",
    "Zirakpur",
  ],
  Rajasthan: [
    "Abu",
    "Ajmer",
    "Alwar",
    "Amer",
    "Barmer",
    "Beawar",
    "Bharatpur",
    "Bhilwara",
    "Bikaner",
    "Bundi",
    "Chittaurgarh",
    "Churu",
    "Dhaulpur",
    "Dungarpur",
    "Ganganagar",
    "Hanumangarh",
    "Jaipur",
    "Jaisalmer",
    "Jalor",
    "Jhalawar",
    "Jhunjhunu",
    "Jodhpur",
    "Kishangarh",
    "Kota",
    "Merta",
    "Nagaur",
    "Nathdwara",
    "Pali",
    "Phalodi",
    "Pushkar",
    "Sawai Madhopur",
    "Shahpura",
    "Sikar",
    "Sirohi",
    "Tonk",
    "Udaipur",
  ],
  Sikkim: ["Gangtok", "Gyalsing", "Lachung", "Mangan"],
  "Tamil Nadu": [
    "Arcot",
    "Chengalpattu",
    "Chennai",
    "Chidambaram",
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kanchipuram",
    "Kanniyakumari",
    "Kodaikanal",
    "Kumbakonam",
    "Madurai",
    "Mamallapuram",
    "Nagappattinam",
    "Nagercoil",
    "Palayankottai",
    "Pudukkottai",
    "Rajapalaiyam",
    "Ramanathapuram",
    "Salem",
    "Thanjavur",
    "Tiruchchirappalli",
    "Tirunelveli",
    "Tiruppur",
    "Tuticorin",
    "Udhagamandalam",
    "Vellore",
  ],
  Telangana: [
    "Hyderabad",
    "Karimnagar",
    "Khammam",
    "Mahbubnagar",
    "Nizamabad",
    "Sangareddi",
    "Warangal",
  ],
  Tripura: ["Agartala"],
  "Uttar Pradesh": [
    "Agra",
    "Aligarh",
    "Amroha",
    "Ayodhya",
    "Azamgarh",
    "Bahraich",
    "Ballia",
    "Banda",
    "Bara Banki",
    "Bareilly",
    "Basti",
    "Bijnor",
    "Bithur",
    "Budaun",
    "Bulandshahr",
    "Deoria",
    "Etah",
    "Etawah",
    "Faizabad",
    "Farrukhabad-cum-Fatehgarh",
    "Fatehpur",
    "Fatehpur Sikri",
    "Ghaziabad",
    "Ghazipur",
    "Gonda",
    "Gorakhpur",
    "Hamirpur",
    "Hardoi",
    "Hathras",
    "Jalaun",
    "Jaunpur",
    "Jhansi",
    "Kannauj",
    "Kanpur",
    "Lakhimpur",
    "Lalitpur",
    "Lucknow",
    "Mainpuri",
    "Mathura",
    "Meerut",
    "Mirzapur-Vindhyachal",
    "Moradabad",
    "Muzaffarnagar",
    "Noida",
    "Partapgarh",
    "Pilibhit",
    "Prayagraj",
    "Rae Bareli",
    "Rampur",
    "Saharanpur",
    "Sambhal",
    "Shahjahanpur",
    "Sitapur",
    "Sultanpur",
    "Tehri",
    "Varanasi",
  ],
  Uttarakhand: [
    "Almora",
    "Dehra Dun",
    "Haridwar",
    "Mussoorie",
    "Nainital",
    "Pithoragarh",
    "Rishikesh",
  ],
  "West Bengal": [
    "Alipore",
    "Alipur Duar",
    "Asansol",
    "Baharampur",
    "Bally",
    "Balurghat",
    "Bankura",
    "Baranagar",
    "Barasat",
    "Barrackpore",
    "Basirhat",
    "Bhatpara",
    "Bishnupur",
    "Budge Budge",
    "Burdwan",
    "Chandernagore",
    "Darjiling",
    "Diamond Harbour",
    "Dum Dum",
    "Durgapur",
    "Halisahar",
    "Haora",
    "Hugli",
    "Ingraj Bazar",
    "Jalpaiguri",
    "Kalimpong",
    "Kamarhati",
    "Kanchrapara",
    "Kharagpur",
    "Kolkata",
    "Krishnanagar",
    "Malda",
    "Midnapore",
    "Murshidabad",
    "Navadwip",
    "Palashi",
    "Panihati",
    "Purulia",
    "Raiganj",
    "Santipur",
    "Shantiniketan",
    "Shrirampur",
    "Siliguri",
    "Siuri",
    "Tamluk",
    "Titagarh",
  ],
};

const resourceTypes = [
  "Oxygen",
  "Hospital Beds",
  "Medicines/Injections",
  "Blood",
  "Home Care",
  "Testing",
  "Food / Tiffin",
  "Ambulance",
  "Tele consultation",
];

const resourceSubtypes = {
  Oxygen: ["New Cylinder", "Refill", "Concentrator", "Cans"],
  "Hospital Beds": [
    "ICU Bed",
    "Ventilator Bed",
    "Oxygen Beds",
    "Non-Oxygen Beds",
  ],
  "Medicines/Injections": ["Remdesivir", "Fabiflu", "Tocilizumab"],
  Blood: ["Plasma", "Blood"],
  "Home Care": ["Home ICU Setup", "Nursing Staff"],
  Testing: ["Home Testing", "Lab Testing"],
  "Food / Tiffin": ["Tiffin Service", "Meal Provider"],
  Ambulance: ["Normal", "Advanced Life Support"],
  "Tele consultation": ["Tele consultation"],
};

const CREATE_TICKET = gql`
  mutation (
    $state: String
    $city: String
    $address: String
    $supplierDonorName: String
    $supplierDonorContactNumber: String
    $resourceType: String
    $subResourceType: String
    $costPerUnit: String
    $availableUnits: String
    $otherInfo: String
    $secretKey: String
  ) {
    createTicket(
      input: {
        state: $state
        city: $city
        address: $address
        supplierDonorName: $supplierDonorName
        supplierDonorContactNumber: $supplierDonorContactNumber
        resourceType: $resourceType
        subResourceType: $subResourceType
        costPerUnit: $costPerUnit
        availableUnits: $availableUnits
        otherInfo: $otherInfo
        secretKey: $secretKey
      }
    ) {
      status
    }
  }
`;

const AddResources = (props) => {
  const classes = useStyles();

  const { theme } = props;

  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [location, setLocation] = useState("");
  const [resource_type, setResourceType] = useState("");
  const [resource_subtype, setResourceSubtype] = useState("");
  const [availability, setAvailability] = useState("");
  const [cost_per_unit, setCostPerUnit] = useState("");
  const [contact_name, setContactName] = useState("");
  const [contact_number, setContactNumber] = useState("");
  const [lead_source, setLeadSource] = useState("");
  const [password, setPassword] = useState("");

  const [cityError, setCityError] = useState(false);
  const [stateError, setStateError] = useState(false);
  const [resourceError, setResourceError] = useState(false);
  const [subResourceError, setSubResourceError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [numberError, setNumberError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [messageState, setMessageState] = useState("");

  const locationRouter = useLocation();
  const isVerifiedLeadPage =
    locationRouter.pathname === VERIFIED_LEAD_PAGE_ROUTE;

  const [createTicket, { loading }] = useMutation(CREATE_TICKET, {
    variables: {
      state,
      city,
      address: location || "",
      supplierDonorName: contact_name || "",
      supplierDonorContactNumber: contact_number || "",
      resourceType: resource_type || "",
      subResourceType: resource_subtype || "",
      costPerUnit: cost_per_unit || "",
      availableUnits: availability || "",
      otherInfo: lead_source || "",
      secretKey: password || "",
    },
    update(proxy, result) {
      console.log(result);
      if (
        result &&
        result.data &&
        result.data.createTicket &&
        result.data.createTicket.status === "200"
      ) {
        //
        setDialogMessage("Resource Uploaded Successfully");
        setMessageState("success");
        setDialogOpen(true);
      } else {
        setDialogMessage(
          result?.data?.createTicket?.message ??
            "Error uploading resource, Please try again later."
        );
        setMessageState("error");
        setDialogOpen(true);
      }
    },
    onError(err) {
      setMessageState("error");
      setDialogMessage(
        err.message ?? "Error uploading resource, Please try again later."
      );
      setDialogOpen(true);
    },
    client: apolloClient,
  });

  const checkDataAndSubmit = () => {
    let error = false;

    if (!city) {
      setCityError(true);
      error = true;
    }
    if (!state) {
      setStateError(true);
      error = true;
    }
    if (!resource_type) {
      setResourceError(true);
      error = true;
    }
    if (!resource_subtype) {
      setSubResourceError(true);
      error = true;
    }
    if (!contact_name) {
      setNameError(true);
      error = true;
    }
    if (!contact_number) {
      setNumberError(true);
      error = true;
    }

    if (isVerifiedLeadPage && !password.trim()) {
      setPasswordError(true);
      error = true;
    }

    if (!error) createTicket();
  };

  return (
    <>
      <div className={classes.root}>
        <div className={classes.headingRoot}>
          <Typography variant="h5">Add Verified Information</Typography>
          <Typography
            variant="body1"
            style={{
              marginTop: theme.spacing(3),
              opacity: 0.6,
              maxWidth: theme.spacing(67.75),
            }}
          >
            The information being submitted by you could help save someone's
            life. Please fill the form below to add information. Our team of
            volunteers will verify the details before making it accessible to
            others.
          </Typography>
        </div>
        <div className={classes.formRoot}>
          <Autocomplete
            options={states}
            getOptionLabel={(option) => option}
            style={{ width: "100%" }}
            onChange={(event, state) =>
              setState(state) ||
              setCity("") ||
              setStateError(false) ||
              setCityError(false)
            }
            renderInput={(params) => (
              <TextField
                autoComplete="off"
                {...params}
                error={stateError}
                label="State"
                variant="outlined"
                required
              />
            )}
          />
          <Autocomplete
            options={cities[state] || []}
            disabled={state in cities ? false : true}
            getOptionLabel={(option) => option}
            style={{ width: "100%" }}
            onChange={(event, city) => setCity(city) || setCityError(false)}
            renderInput={(params) => (
              <TextField
                autoComplete="off"
                {...params}
                error={cityError}
                label="City"
                variant="outlined"
                required
              />
            )}
          />
          <TextField
            style={{ width: "100%" }}
            variant="outlined"
            rows={5}
            label="Address"
            multiline
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <TextField
            select
            error={resourceError}
            style={{ width: "100%" }}
            variant="outlined"
            value={resource_type}
            label="Resource Type"
            onChange={(event) =>
              setResourceType(event.target.value) ||
              setResourceError(false) ||
              setResourceSubtype("") ||
              setSubResourceError(false)
            }
          >
            {resourceTypes.map((type) => (
              <MenuItem value={type} key={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            error={subResourceError}
            variant="outlined"
            style={{ width: "100%" }}
            value={resource_subtype}
            disabled={resource_type.length ? false : true}
            label="Resource Subtype"
            onChange={(event) =>
              setResourceSubtype(event.target.value) ||
              setSubResourceError(false)
            }
          >
            {resource_type.length
              ? resourceSubtypes[resource_type].map((type) => (
                  <MenuItem value={type} key={type}>
                    {type}
                  </MenuItem>
                ))
              : null}
          </TextField>
          <TextField
            select
            variant="outlined"
            style={{ width: "100%" }}
            value={availability}
            label="Availability"
            disabled={
              resource_type === "Blood" || resource_type === "Food / Tiffin"
            }
            onChange={(event) => setAvailability(event.target.value)}
          >
            <MenuItem value={"Available"} key={"Available"}>
              {"Available"}
            </MenuItem>

            <MenuItem value={"Unavailable"} key={"Unavailable"}>
              {"Unavailable"}
            </MenuItem>
          </TextField>
          <TextField
            style={{ width: "100%" }}
            variant="outlined"
            label="Cost per Unit (in ₹)"
            type="number"
            value={cost_per_unit}
            onChange={(e) => setCostPerUnit(e.target.value)}
          />
          <TextField
            style={{ width: "100%" }}
            error={nameError}
            variant="outlined"
            required
            label="Contact Name"
            value={contact_name}
            onChange={(e) =>
              setContactName(e.target.value) || setNameError(false)
            }
          />
          <TextField
            style={{ width: "100%" }}
            error={numberError}
            variant="outlined"
            required
            label="Phone Number"
            type="phone"
            value={contact_number}
            onChange={(e) =>
              setContactNumber(e.target.value) || setNumberError(false)
            }
          />
          <TextField
            style={{ width: "100%" }}
            variant="outlined"
            label="Other Information"
            value={lead_source}
            onChange={(e) => setLeadSource(e.target.value)}
          />
          {isVerifiedLeadPage && (
            <TextField
              style={{ width: "100%" }}
              variant="outlined"
              label="Password"
              required
              value={password}
              error={passwordError}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
              }}
            />
          )}
          {loading && <LinearProgress className="w-100" />}
          <Button
            className="mb-3"
            name="Add resource"
            onClick={() => checkDataAndSubmit()}
            disabled={loading}
            style={{
              marginTop: theme.spacing(2),
              width: theme.spacing(20),
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            variant="contained"
            color="primary"
            text="Submit"
          />
          {dialogOpen && (
            <Alert
              severity={messageState}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setDialogOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {dialogMessage}
            </Alert>
          )}
        </div>
      </div>
    </>
  );
};

export default withTheme(AddResources);
