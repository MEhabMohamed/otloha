import { ADD_LESSON, ADD_LEVEL, DELETE_LESSON, DELETE_LEVEL, EDIT_LESSON, EDIT_LEVEL, RECEIVE_TAJWEED } from "../actions/tajweed";

export default function tajweed(state: any = {}, action: any): any {
  switch (action.type) {
    case ADD_LEVEL:
      return {
        ...state,
        levels: {
          ...state.levels,
          [action.level.id]: action.level
        }
      };
    case ADD_LESSON:
      return {
        ...state,
        lessons: {
          ...state.lessons,
          [action.lesson.id]: action.lesson
        }
      };
    case RECEIVE_TAJWEED:
      return {
        ...state,
        ...action.tajweed
      };
    case EDIT_LEVEL:
      return {
        ...state,
        levels: {
          ...state.levels,
          [action.id]: {
            ...state.levels[action.id],
            name: action.name,
            color: action.color,
            value: action.value
          }
        }
      };
    case EDIT_LESSON:
      return {
        ...state,
        lessons: {
          ...state.lessons,
          [action.id]: {
            ...state.lessons[action.id],
            title: action.title,
            content: action.content,
            level: action.level,
            parentLesson: action.parentLesson
          }
        }
      };
    case DELETE_LEVEL:
      return {
        ...state,
        levels: Object.fromEntries(
          Object.entries(state.levels).filter((e: any) => e[0] !== action.id)
        )
      };
    case DELETE_LESSON:
      return {
        ...state,
        lessons: Object.fromEntries(
          Object.entries(state.lessons).filter((e: any) => e[0] !== action.id)
        )
      };
    default:
      return state;
  }
}
