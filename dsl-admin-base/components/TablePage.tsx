import { ReactNode } from 'react';
import { Props as AppPaginationProps, AppPagination } from './AppPagination';

interface Props {
  pagination: AppPaginationProps;
}

export const TablePage: React.FC<Props> = ({ pagination, children }) => {
  const { topLeftAction, ...rest } = pagination;
  const renderPagination = (topLeftAction?: ReactNode) => {
    return <AppPagination {...rest} topLeftAction={topLeftAction}></AppPagination>;
  };

  return (
    <>
      {renderPagination(topLeftAction)}
      {children}
      {renderPagination()}
    </>
  );
};
