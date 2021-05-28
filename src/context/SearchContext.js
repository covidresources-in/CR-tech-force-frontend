import createDataContext from './createDataContext';

const searchReducer = (state, action) => {
  switch (action.type) {
    case 'add_error':
      return { ...state, errorMessage: action.payload };
    case 'clear_error_message':
      return { ...state, errorMessage: '' };
    case 'search_input':
      return { errorMessage: '', searchInputs: action.payload };
    default:
      return state;
  }
};

const clearErrorMessage = (dispatch) => () => {
  dispatch({
    type: 'clear_error_message',
  });
};

const searchInputs = (dispatch) => async ({ state, city, requirement, subrequirement }) => {
  try {
    dispatch({ type: 'search_input', payload: { state, city, requirement, subrequirement } });
  } catch (err) {
    dispatch({
      type: 'add_error',
      payload: 'Something went wrong',
    });
  }
};

export const { Context, Provider } = createDataContext(
  searchReducer,
  { searchInputs, clearErrorMessage },
  { errorMessage: '' }
);
