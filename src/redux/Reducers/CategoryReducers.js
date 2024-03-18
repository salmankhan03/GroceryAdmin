import {
    ADD_CATEGORY
  } from '../Constants/CategoryConstants';
  const settingLocalStorage = localStorage.getItem('_category');

// initial setting to local Storage
const initialStateLocalStorage = {
  category: JSON.parse(settingLocalStorage)
    ? JSON.parse(settingLocalStorage)
    : null,
};

// setting local storage reducer
export const categoryReducer = (state = initialStateLocalStorage, action) => {
  switch (action.type) {
    case ADD_CATEGORY:
        return {
            ...state,
            category: action.payload,
          };

   

    default:
      return state;
  }
};