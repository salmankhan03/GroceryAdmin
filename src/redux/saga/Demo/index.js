import { takeEvery, put } from 'redux-saga/effects';

function* demoSaga(action) {
    try {
        console.log('working on saga!!!!!!')
        // Perform your async task here, e.g., API call
        // const data = yield call(api.fetchData, action.payload);

        // Dispatch a success action with the received data
        // yield put(fetchDataSuccess(data));
    } catch (error) {
        // Dispatch a failure action if there's an error
        // yield put(fetchDataFailure(error));
    }
}

// Watch for the FETCH_DATA action and run fetchDataSaga
export function* watchFetchData() {
    yield takeEvery('FETCH_DATA', demoSaga); // Replace with your actual action type
}