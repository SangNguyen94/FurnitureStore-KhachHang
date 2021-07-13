import { observer } from 'mobx-react-lite';
import { useContext, useEffect } from 'react';
import { Table, Button, Dropdown, Icon } from 'semantic-ui-react';
import React from 'react';
import { RootStoreContext } from '../../../app/stores/rootStore';

interface IProps {}

const SellerProductSearch: React.FC<IProps> = () => {
  const rootStore = useContext(RootStoreContext);
  const { setPredicate, loadFilters } = rootStore.productStore;
  const { loadOptions, categoryOptionsRegistry, brandOptionsRegistry } = rootStore.productOptions;

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  return (
    <Table.Row key='searchRow'>
      <Table.Cell></Table.Cell>
      <Table.Cell>
        <div className='ui input' >
          <input
            key='nameSearch'
            placeholder='Tên sản phẩm'
            onBlur={(e) => {
              setPredicate('name', e.target.value);
            }}
          />
        </div>
      </Table.Cell>
      <Table.Cell>
        <Dropdown
          fluid={false}
          placeholder='Chọn loại '
          search
          selection
          onChange={(e, data) => {
            setPredicate('category', data.value!.toString());
          }}
          options={categoryOptionsRegistry}
        />
      </Table.Cell>
      <Table.Cell>
        <Dropdown
          fluid={false}
          placeholder='Chọn hãng'
          search
          selection
          onChange={(e, data) => {
            setPredicate('brand', data.value!.toString());
          }}
          options={brandOptionsRegistry}
        />
      </Table.Cell>
     
      <Table.Cell >
        <Button.Group>
          <Button color='green' onClick={() => loadFilters(false)}>
            <Icon name='search' />
          </Button>
          <Button color='grey' onClick={() => loadFilters(true)}>
            <Icon name='redo' />
          </Button>
        </Button.Group>
      </Table.Cell>
    </Table.Row>
  );
};

export default observer(SellerProductSearch);
