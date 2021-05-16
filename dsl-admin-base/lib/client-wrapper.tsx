import { useContext, useEffect } from 'react';
import { AppContextComponent } from '../lib/context';
import { RepositoryFactory } from '../repositories/RepositoryFactory';

export const ClientWrapper: React.FC = ({ children }) => {
  const { state, dispatch } = useContext(AppContextComponent);

  useEffect(() => {
    if (state.loggedIn) {
      const fetchUser = async () => {
        try {
          const user = await RepositoryFactory.get('company').getCurrentUser();
          dispatch({ type: 'set-user', payload: user });
        } catch (e) {
          console.log(e);
        }
      };

      fetchUser();

      const fetchDetails = async () => {
        const data = await RepositoryFactory.get('company').get();
        dispatch({ type: 'set-fee', payload: data.fee });
      };

      fetchDetails();
    }
  }, [state.loggedIn]);
  return <>{children}</>;
};
