import React from 'react'
import { Formik, Form, Field } from 'formik';
import { resourcesMap } from './resources-data';
import { Button, makeStyles, TextField, Typography } from '@material-ui/core';
import { useMutation } from '@apollo/client';
import { CREATE_TICKET } from './graphql-queries';
import { Alert, Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab';
import statesCitiesData from '../../utils/state-city-map';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { VERIFIED_LEAD_PAGE_ROUTE } from '../../App';

interface Values {
    state: string;
    city: string;
    pincode: Number | null;
    address: string;
    resourceType: string;
    resourceSubtype: string;
    contactName: string;
    phoneNumber: number | null;
    description: string;
    secretKey: string;
}

interface ValuesErrors extends Omit<Values, 'pincode' | 'phoneNumber'> {
    pincode: string;
    phoneNumber: string;
}

const initialValues: Values = {
    state: '',
    city: '',
    address: '',
    contactName: '',
    phoneNumber: null,
    pincode: null,
    description: '',
    resourceType: '',
    resourceSubtype: '',
    secretKey: '',
}

const useStyles = makeStyles((theme) => ({
    primaryBackground: {
        backgroundColor: theme.palette.primary.main
    },
    whiteText: {
        color: '#FFF'
    }
}));

const validateForm = (values: Values) => {
    const errors: Partial<ValuesErrors> = {};

    if (!values.state || !values.state.trim()) {
        errors.state = `It's important to know`
    }

    if (!values.city || !values.city.trim()) {
        errors.city = `It's important to know`
    }

    if (!values.resourceType.trim()) {
        errors.resourceType = `It's important to know`
    }

    if (!values.resourceSubtype.trim()) {
        errors.resourceSubtype = `It's important to know`
    }

    if (!values.contactName.trim()) {
        errors.contactName = `It's important to know`
    }

    if (!values.phoneNumber) {
        errors.phoneNumber = `It's important to know`
    }

    return errors;
}


function AddEditResource() {
    const classes = useStyles();
    const isSmBreakpointAndAbove = useMediaQuery('(min-width: 600px)');
    const isVerifiedLeadPage = window.location.pathname.includes(VERIFIED_LEAD_PAGE_ROUTE);

    const [createTicket] = useMutation(CREATE_TICKET, {
        update(_proxy, result) {
            console.log(result);
        },
    });

    const handleSubmit = (values: Values) => {
        const {
            state, city, resourceType, resourceSubtype,
            address, pincode, contactName, phoneNumber,
            description, secretKey
        } = values

        createTicket({
            variables: {
                state, city, contactName, phoneNumber, resourceType,
                resourceSubtype, address, pincode, description,
                secretKey
            }
        });
    }


    return (
        <>
            <div className="d-flex justify-content-center mb-5">
                <div className={`${classes.primaryBackground} p-5`} style={{ width: isSmBreakpointAndAbove ? '90%' : '100%' }}>
                    <Typography variant="h5" className={`${classes.whiteText} mb-3 d-flex justify-content-center`}>Add Verified Information</Typography>
                    <div className="d-flex justify-content-center">
                        <Typography
                            className={`${classes.whiteText} ${isSmBreakpointAndAbove ? 'w-75' : ''} d-flex justify-content-center`}
                            variant="subtitle1"
                            style={{ opacity: 0.6 }}
                        >
                            The information being submitted by you could help save someone's
                            life. Please fill the form below to add information. Our team of
                            volunteers will verify the details before making it accessible to
                            others.
                </Typography>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <Formik initialValues={initialValues} validate={validateForm} onSubmit={handleSubmit}>
                    {({ values, touched, setValues, errors, submitForm, isValid }) => (
                        <Form className={`${isSmBreakpointAndAbove ? 'w-50' : ''}`}>
                            <Field
                                as={Autocomplete}
                                options={statesCitiesData.map(stateCity => stateCity.state)}
                                getOptionLabel={(option: Values | string) => {
                                    if (typeof option === 'string') {
                                        return option
                                    }
                                    if (option.state) {
                                        return option.state
                                    }
                                    return ''
                                }}
                                className="mb-4"
                                onChange={(event: any, state: string) => {
                                    setValues({
                                        ...values,
                                        state: state || event.target.value,
                                        city: ''
                                    })
                                }}
                                renderInput={(params: AutocompleteRenderInputParams) =>
                                    <TextField
                                        {...params}
                                        autoComplete="off"
                                        error={touched.state && (typeof errors.state === 'string' && errors.state.length > 0)}
                                        label="State"
                                        name="state"
                                        variant="outlined"
                                        value={values.state}
                                        required
                                    />
                                }
                            />
                            <Field
                                as={Autocomplete}
                                options={statesCitiesData.find(stateCity => stateCity.state === values.state)?.cities || []}
                                getOptionLabel={(option: Values | string) => {
                                    if (typeof option === 'string') {
                                        return option
                                    }
                                    if (option.city) {
                                        return option.city
                                    }
                                    return ''
                                }}
                                className="mb-4"
                                onChange={(event: any, city: string) => {
                                    setValues({
                                        ...values,
                                        city
                                    })
                                }}
                                renderInput={(params: AutocompleteRenderInputParams) =>
                                    <TextField
                                        {...params}
                                        error={touched.city && (typeof errors.city === 'string' && errors.city.length > 0)}
                                        label="City"
                                        name="city"
                                        variant="outlined"
                                        required
                                        value={values.city || ''}
                                    />
                                }
                            />
                            <Field
                                as={TextField}
                                className="mb-4"
                                onChange={(event: any) => {
                                    setValues({
                                        ...values,
                                        pincode: event.target.value
                                    })
                                }}
                                value={values.pincode || ''}
                                variant="outlined"
                                label="Pincode"
                                name="pincode"
                                type="number"
                                fullWidth
                                error={touched.pincode && (typeof errors.pincode === 'string' && errors.pincode.length > 0)}
                            />
                            <Field
                                as={TextField}
                                className="mb-4"
                                onChange={(event: any) => {
                                    setValues({
                                        ...values,
                                        address: event.target.value
                                    })
                                }}
                                value={values.address || ''}
                                variant="outlined"
                                multiline
                                label="Address"
                                name="address"
                                fullWidth
                                rows={4}
                                error={touched.address && (typeof errors.address === 'string' && errors.address.length > 0)}
                            />
                            <Field
                                as={Autocomplete}
                                options={resourcesMap.map(resources => resources.type)}
                                className="mb-4"
                                onChange={(event: any, resourceType: string) => {
                                    setValues({
                                        ...values,
                                        resourceType,
                                        resourceSubtype: ''
                                    })
                                }}
                                getOptionLabel={(option: Values | string) => {
                                    if (typeof option === 'string') {
                                        return option
                                    }
                                    if (option.resourceType) {
                                        return option.resourceType
                                    }
                                    return ''
                                }}
                                renderInput={(params: AutocompleteRenderInputParams) =>
                                    <TextField
                                        {...params}
                                        error={touched.resourceType && (typeof errors.resourceType === 'string' && errors.resourceType.length > 0)}
                                        label="Resource Type"
                                        name="resourceType"
                                        variant="outlined"
                                        required
                                        value={values.resourceType || ''}
                                    />
                                }
                            />
                            <Field
                                as={Autocomplete}
                                options={resourcesMap.find(resource => resource.type === values.resourceType)?.subTypes || []}
                                className="mb-4"
                                onChange={(event: any, resourceSubtype: string) => {
                                    setValues({
                                        ...values,
                                        resourceSubtype
                                    })
                                }}
                                getOptionLabel={(option: Values | string) => {
                                    if (typeof option === 'string') {
                                        return option
                                    }
                                    if (option.resourceSubtype) {
                                        return option.resourceSubtype
                                    }
                                    return ''
                                }}
                                renderInput={(params: AutocompleteRenderInputParams) =>
                                    <TextField
                                        {...params}
                                        error={touched.resourceSubtype && (typeof errors.resourceSubtype === 'string' && errors.resourceSubtype.length > 0)}
                                        label="Resource Subtype"
                                        name="resourceType"
                                        variant="outlined"
                                        required
                                        value={values.resourceSubtype || ''}
                                    />
                                }
                            />
                            <Field
                                as={TextField}
                                className="mb-4"
                                onChange={(event: any) => {
                                    setValues({
                                        ...values,
                                        contactName: event.target.value
                                    })
                                }}
                                value={values.contactName || ''}
                                variant="outlined"
                                label="Contact Name"
                                name="contactName"
                                required
                                fullWidth
                                error={touched.contactName && (typeof errors.contactName === 'string' && errors.contactName.length > 0)}
                            />
                            <Field
                                as={TextField}
                                className="mb-4"
                                onChange={(event: any) => {
                                    setValues({
                                        ...values,
                                        phoneNumber: event.target.value
                                    })
                                }}
                                value={values.phoneNumber || ''}
                                variant="outlined"
                                label="Phone Number"
                                name="phoneNumber"
                                type="number"
                                required
                                fullWidth
                                error={touched.phoneNumber && (typeof errors.phoneNumber === 'string' && errors.phoneNumber.length > 0)}
                            />
                            <Field
                                as={TextField}
                                className="mb-4"
                                onChange={(event: any) => {
                                    setValues({
                                        ...values,
                                        description: event.target.value
                                    })
                                }}
                                value={values.description || ''}
                                variant="outlined"
                                label="Description"
                                name="description"
                                fullWidth
                                multiline
                                rows={4}
                                error={touched.description && (typeof errors.description === 'string' && errors.description.length > 0)}
                            />
                            {isVerifiedLeadPage && <Field
                                as={TextField}
                                className="mb-4"
                                onChange={(event: any) => {
                                    setValues({
                                        ...values,
                                        secretKey: event.target.value
                                    })
                                }}
                                value={values.secretKey || ''}
                                variant="outlined"
                                label="Secret Key"
                                name="secretKey"
                                required
                                fullWidth
                                error={touched.secretKey && (typeof errors.secretKey === 'string' && errors.secretKey.length > 0)}
                            />}
                            {!isValid && <Alert className="mb-3" severity="error">
                                Please fill all mandatory fields
                                </Alert>}
                            <div className="d-flex justify-content-center">
                                <Button size="large" variant="contained" color="primary" onClick={submitForm}>
                                    Submit
                            </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    )
}

export default AddEditResource
