import { createContext, useContext } from 'react';

import type { Contract } from 'types/contract';

const ContractsContext = createContext<Contract[]>([]);

export const useContracts = () => {
  return useContext(ContractsContext);
};

export default ContractsContext;
