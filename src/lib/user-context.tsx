'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { UserState, UserPlan } from './utils';

const initialState: UserState = {
  isAuthenticated: false,
  user: null
};

type UserAction = 
  | { type: 'LOGIN'; payload: { email: string; name: string; plan: UserPlan } }
  | { type: 'LOGOUT' };

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'LOGIN':
      return {
        isAuthenticated: true,
        user: {
          email: action.payload.email,
          name: action.payload.name,
          plan: action.payload.plan
        }
      };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}

const UserContext = createContext<{
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
} | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}