'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { UserState, UserPlan } from './utils';
import { Session } from 'next-auth';

interface UserPayload {
  email: string;
  name: string | null;
  plan: UserPlan;
  subscriptionEndDate: Date | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  user: {
    email: '',
    name: null,
    plan: 'free' as UserPlan,
    subscriptionEndDate: null,
  }
};

type UserAction = 
  | { type: 'LOGIN'; payload: UserPayload }
  | { type: 'LOGOUT' };

function userReducer(state: UserState, action: UserAction): UserState {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
            };
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            };
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