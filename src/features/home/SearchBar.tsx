import _ from 'lodash';

import { Search, Grid, Header, Segment, Label } from 'semantic-ui-react'
import React, { useContext } from 'react'
import { Card } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';
//import { RootStoreContext } from '../../../app/stores/rootStore';
import ProductCardItem from './ProductCardItem';
import { RootStoreContext } from '../../app/stores/rootStore';
import { IProduct } from '../../app/models/product';
import CartItemSmall from '../CartCheckOut/CartItemSmall';
import { useHistory } from 'react-router-dom';
const src = './ORIGINAL.jpg'

const source = _.times(5, () => ({
  title: "Stuff like this",
  description: "Stuff like that",
  image:"this is pics",
  price:"210$",
}))

const initialState = {
  loading: false,
  results: [],
  value: '',
}

function exampleReducer(state:any, action:any) {
  switch (action.type) {
    case 'CLEAN_QUERY':
      return initialState
    case 'START_SEARCH':
      return { ...state, loading: true, value: action.query }
    case 'FINISH_SEARCH':
      return { ...state, loading: false, results: action.results }
    case 'UPDATE_SELECTION':
      return { ...state, value: action.selection }

    default:
      throw new Error()
  }
}

const SearchBar :React.FC<{  }> = ({  })=> {
  const [state, dispatch] = React.useReducer(exampleReducer, initialState)
  const { loading, results, value } = state
  const rootStore = useContext(RootStoreContext);
  const { allProductRegistry, predicate,loadProducts ,loadProductsAll,productRegistry} = rootStore.productStore;
  const lstProduct = Array.from(productRegistry.values());
  const timeoutRef = React.useRef<number>()
  const resultRenderer = ( product:IProduct ) =>{
    return(
    <CartItemSmall ProductDTO={product} quantity={0}>

    </CartItemSmall>
    )
  } ;
  var history=useHistory();
 // handleResultSelect = (e, { result }) => this.setState({ value: result.title })

 const handleResultSelect = (e:any, result:any) => {
  
    
    console.log("result "+JSON.stringify(result));
}
  const handleSearchChange = React.useCallback((e, data) => {
    clearTimeout(timeoutRef.current)
    dispatch({ type: 'START_SEARCH', query: data.value })
    let listProduct = Array.from(productRegistry.values());
    console.log("got here");
  //  var timerId: number = window.setTimeout(() => {}, 1000)
    timeoutRef.current = window.setTimeout(() => {
      if (data.value.length === 0) {
        dispatch({ type: 'CLEAN_QUERY' })
        console.log("this is bad");
        return;
      }


      const re = new RegExp(_.escapeRegExp(data.value), 'i')
      const isMatch = (result:any) => re.test(result.title)
      const newArrayOfObj = listProduct.map(({
        name: title,
        brand:description,
        ...rest
      }) => ({
        title,
        description,
        ...rest
      }));
      if(listProduct[1])
      {
        console.log("ismatch "+isMatch(listProduct[1]));
      }
    
      dispatch({
        type: 'FINISH_SEARCH',
        results: _.filter(newArrayOfObj, isMatch),
      })
    }, 500)
  }, [])
  React.useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
      loadProductsAll()
    }
  }, [loadProductsAll])
  if(lstProduct[1])
  {
    console.log("search bar: "+JSON.stringify(lstProduct[1].name));
  }

  return (
    <Grid >
      <Grid.Column width={16}  >
        <Search 
        
          input={{ width: "1999rem" }}
          size="huge"
          loading={loading}
          onResultSelect={(e, data) =>
            history.push(`/product/${data.result.id}`)
            
          }
          // resultRenderer={resultRenderer}
          placeholder="Search"
          
          onSearchChange={handleSearchChange}
          results={results}
          value={value}
        >
          
          </Search>
     
      </Grid.Column>
    </Grid>
  )
}

export default SearchBar