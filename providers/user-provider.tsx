"use client";

import * as React from "react";
import type { User, UserRole } from "@/lib/types";
import { demoUsers } from "@/lib/mock-data";

interface UserContextValue {
  user: User;
  setUser: (user: User) => void;
  setRole: (role: UserRole) => void;
}

const UserContext = React.createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User>(demoUsers[0]);

  const setRole = React.useCallback((role: UserRole) => {
    const match = demoUsers.find((u) => u.role === role);
    if (match) setUser(match);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, setRole }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = React.useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within UserProvider");
  }
  return ctx;
}
