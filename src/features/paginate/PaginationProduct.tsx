import React, { useContext } from 'react';
import { Pagination } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';

interface IProps {
  handlePageChange: () => void;
}

const PaginationProduct: React.FC<IProps> = ({ handlePageChange }) => {
  const rootStore = useContext(RootStoreContext);
  const { setPages, page, totalPages } = rootStore.productStore;
  console.log("total pages: "+totalPages);
  return (
    <Pagination
      defaultActivePage={page}
      totalPages={totalPages}
      ellipsisItem={null}
      onPageChange={(e, { activePage }) => {
        setPages(parseInt(activePage!.toString()));
        handlePageChange();
      }}
      
    />
  );
};
export default observer(PaginationProduct);
