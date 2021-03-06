export const EMIT_DRAW_EVENT = 'EMIT_DRAW_EVENT'
export const UPDATE_DRAW_EVENT = 'UPDATE_DRAW_EVENT';
export const CLEAR_WHITEBOARD = 'CLEAR_WHITEBOARD'
export const UPDATE_HISTORY = 'UPDATE_HISTORY'
export const SET_WHITEBOARD = 'SET_WHITEBOARD'
export const SET_ACTION = 'SET_ACTION'

export const setAction = action => ({
    type: SET_ACTION, action
})
export const emitDrawEvent = (start, end, color, action) => {
    return ({
        type: EMIT_DRAW_EVENT,
        start, end, color, action
    })
}

export const setWhiteboard = (whiteboard) => {
    return ({
        type: SET_WHITEBOARD,
        whiteboard
    })
}

export const clearWhiteboard = () => {
    return ({
        type: CLEAR_WHITEBOARD
    })
}

export const updateWhiteboard = (start, end, color, action) => {
    return ({
        type: UPDATE_DRAW_EVENT,
        start, end, color, action
    })
}

export const updateHistory = (start, end, color, action) => {
    return ({
        type: UPDATE_HISTORY,
        start, end, color, action
    })
}

const defaultState = {
    start: 0,
    end: 0,
    color: 'black',
    history: [],
    action: 'draw'
}

export default (state = defaultState, action ) => {
    switch (action.type) {
        case UPDATE_DRAW_EVENT: //this triggeres update in middleware
        case UPDATE_HISTORY: //this does not
        //do not update action when history updates
            const event = {
                start: action.start,
                end: action.end,
                color: action.color,
                action: action.action
            }
            return ({...event, history: [...state.history, event]})
        case CLEAR_WHITEBOARD:
            return defaultState;
        case SET_WHITEBOARD:
            return {...state, history:action.whiteboard};
        case SET_ACTION:
            return {...state, action: action.action}
        default: return state;
    }
}