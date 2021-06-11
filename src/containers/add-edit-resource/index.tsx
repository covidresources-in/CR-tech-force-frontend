import { ApolloError, useLazyQuery, useMutation } from '@apollo/client';
import { Button, LinearProgress, makeStyles, TextField, Typography } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Alert, AlertProps, Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { VERIFIED_LEAD_PAGE_ROUTE } from '../../constants';
import statesCitiesData from '../../utils/state-city-map';
import { CREATE_TICKET, FETCH_TICKET, UPDATE_TICKET } from './graphql-queries';
import { resourcesMap } from './resources-data';

interface Values {
    state: string;
    city: string;
    pincode: Number | null;
    address: string;
    resourceType: string;
    subResourceType: string;
    contactName: string;
    contactNumber: number | null;
    description: string;
}

interface ValuesErrors extends Omit<Values, 'pincode' | 'contactNumber'> {
    pincode: string;
    contactNumber: string;
}

const initialValues: Values = {
    state: '',
    city: '',
    address: '',
    contactName: '',
    contactNumber: null,
    pincode: null,
    description: '',
    resourceType: '',
    subResourceType: '',
}

const isVerifiedLeadPage = window.location.pathname.includes(VERIFIED_LEAD_PAGE_ROUTE);
const useStyles = makeStyles((theme) => ({
    primaryBackground: {
        backgroundColor: theme.palette.primary.main
    },
    whiteText: {
        color: '#FFF'
    }
}));
interface Params {
    uuid: string;
}


function AddEditResource() {
    const classes = useStyles();
    const isSmBreakpointAndAbove = useMediaQuery('(min-width: 600px)');
    const params = useParams<Params>();

    const uuid = params.uuid;
    const isUpdatePage = uuid;
    const [responseMessage, setResponseMessage] = useState({ type: 'success', message: '' } as { type: AlertProps['severity'], message: string })

    const validateForm = (values: Values) => {
        const errors: Partial<ValuesErrors> = {};

        if (!values.state || !values.state.trim()) {
            errors.state = `It's important to know`
        }

        if (!values.city || !values.city.trim()) {
            errors.city = `It's important to know`
        }

        if (values?.pincode) {
            if (values.pincode.toString().length !== 6) {
                errors.pincode = `Pincode has to length of 6 digits`
            }
        }

        if (!values.resourceType.trim()) {
            errors.resourceType = `It's important to know`
        }

        if (!values.subResourceType.trim()) {
            errors.subResourceType = `It's important to know`
        }

        if (!values.contactName.trim()) {
            errors.contactName = `It's important to know`
        }

        if (!values.contactNumber) {
            errors.contactNumber = `It's important to know`
        }

        return errors;
    }

    const [createTicket, { loading: createTicketLoading }] = useMutation(CREATE_TICKET, {
        update(_proxy, result) {
            setResponseMessage({
                type: 'success',
                message: 'Succesfully added the lead'
            })
        },
        onError(error: ApolloError) {
            setResponseMessage({
                type: 'error',
                message: error?.data?.createTicket?.message ?? 'Unknown problem occured in submitting request'
            })
        }
    });

    const [updateTicket, { loading: updateTicketLoading }] = useMutation(UPDATE_TICKET, {
        update(_proxy, result) {
            setResponseMessage({
                type: 'success',
                message: 'Succesfully updated the lead'
            })
        },
        onError(error: ApolloError) {
            setResponseMessage({
                type: 'error',
                message: error?.data?.createTicket?.message ?? 'Unknown problem occured in submitting request'
            })
        }
    });

    const [getTicket, { data: fetchData }] = useLazyQuery(FETCH_TICKET);
    const ticketData = Array.isArray(fetchData?.workspace?.tickets?.edges) ? fetchData?.workspace?.tickets?.edges[0]?.node : null;

    useEffect(() => {
        if (isUpdatePage) {
            getTicket({
                variables: {
                    uuid: uuid
                }
            })
        }
    }, [uuid, isUpdatePage, getTicket]);

    const handleSubmit = (values: Values) => {
        if (isUpdatePage) {
            updateTicket({
                variables: {
                    ...values,
                    status: 'VERIFIED'
                }
            })
        } else {
            createTicket({
                variables: {
                    ...values,
                    status: isVerifiedLeadPage ? 'VERIFIED' : ''
                }
            });
        }
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
                <Formik enableReinitialize initialValues={ticketData || initialValues} validate={validateForm} onSubmit={handleSubmit}>
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
                                        subResourceType: ''
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
                                onChange={(event: any, subResourceType: string) => {
                                    setValues({
                                        ...values,
                                        subResourceType
                                    })
                                }}
                                getOptionLabel={(option: Values | string) => {
                                    if (typeof option === 'string') {
                                        return option
                                    }
                                    if (option.subResourceType) {
                                        return option.subResourceType
                                    }
                                    return ''
                                }}
                                renderInput={(params: AutocompleteRenderInputParams) =>
                                    <TextField
                                        {...params}
                                        error={touched.subResourceType && (typeof errors.subResourceType === 'string' && errors.subResourceType.length > 0)}
                                        label="Resource Subtype"
                                        name="resourceSubType"
                                        variant="outlined"
                                        required
                                        value={values.subResourceType || ''}
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
                                        contactNumber: event.target.value
                                    })
                                }}
                                value={values.contactNumber || ''}
                                variant="outlined"
                                label="Contact Number"
                                name="contactNumber"
                                type="number"
                                required
                                fullWidth
                                error={touched.contactNumber && (typeof errors.contactNumber === 'string' && errors.contactNumber.length > 0)}
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
                            {!isValid && <Alert className="mb-3" severity="error">
                                Please fill all mandatory fields
                                </Alert>}
                            {(createTicketLoading || updateTicketLoading) && <LinearProgress className="w-100" />}
                            <div className="d-flex justify-content-center mb-3">
                                <Button size="large" variant="contained" color="primary" onClick={submitForm}>
                                    {isUpdatePage ? 'Update' : 'Submit'}
                                </Button>
                            </div>
                            {responseMessage.message && <Alert severity={responseMessage.type}>
                                {responseMessage.message}
                            </Alert>}
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    )
}

export default AddEditResource
