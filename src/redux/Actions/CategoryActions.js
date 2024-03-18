import {
    ADD_CATEGORY,
  } from '../Constants/CategoryConstants';
  
  // add side bar menu
  export const addCatergory = (name) => async (dispatch, getState) => {
    dispatch({
      type: ADD_CATEGORY,
      payload: name,
    });
  
    localStorage.setItem(
      '_category',
      JSON.stringify(getState().addTocategory.category)
    );
  };
  
