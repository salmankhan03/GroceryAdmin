import { all } from 'redux-saga/effects';

import { watchFetchData } from './Demo/index';

function* rootSaga() {
    yield all([
        watchFetchData(),
    ]);
}

export default rootSaga;