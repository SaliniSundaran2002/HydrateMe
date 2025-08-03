import React, { createContext, useContext, useState } from 'react';

const GoalContext = createContext({ goalMl: 0, setGoalMl: (ml: number) => {} });

export const GoalProvider = ({ children }: any) => {
  const [goalMl, setGoalMl] = useState(2000);
  return (
    <GoalContext.Provider value={{ goalMl, setGoalMl }}>
      {children}
    </GoalContext.Provider>
  );
};

export const useGoal = () => useContext(GoalContext);