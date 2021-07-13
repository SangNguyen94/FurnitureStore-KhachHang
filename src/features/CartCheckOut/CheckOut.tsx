import React, { useContext, useEffect, useState } from 'react';
import { Button, Label, Table, Icon, Card, Image, Grid, GridRow, Segment, Form, Radio } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { format, zonedTimeToUtc } from 'date-fns-tz';
import moment from "moment-timezone";


import { Form as FinalForm, Field } from 'react-final-form';
import { IProduct } from '../../app/models/product';
import {withRouter} from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import FullCart from './FullCart';
import { combineValidators, isRequired, composeValidators, isNumeric } from 'revalidate';
import { OrderFormValues } from '../../app/models/order';
import TextInput from '../../app/common/form/TextInput';
import DateInput from '../../app/common/form/DateInput';
import NumberInput from '../../app/common/form/NumberInput';
import SelectInput from '../../app/common/form/SelectInput';
import { getCurrentDate } from '../../app/common/exportTable/TableToExcel';
import { autorun } from 'mobx';

const options = [
  { key: 'm', text: 'Nam', value: 'male' },
  { key: 'f', text: 'Nu', value: 'female' },
  { key: 'o', text: 'Khac', value: 'other' },
]
const orderOption = [
  { key: 'h', text: 'Giao tan noi', value: 'deliver' },
  { key: 'os', text: 'Nhan tai cua hang', value: 'onsite' },

]

const validate = combineValidators({
  recipientName: isRequired('Name'),
  recipientAddress: isRequired('Address'),
  recipientPhone: composeValidators(isRequired('Phone'), isNumeric('Phone'))(),
 
});
const src = 'assets/ORIGINAL.jpg'
const CheckOut: React.FC<{ ProductDTO: IProduct; index: number; fluid: boolean }> = ({ ProductDTO, index, fluid }) => {
  const rootStore = useContext(RootStoreContext);
  const {cartCount,loadCart,getCart,cartRegistry,selectedCart,CountCart,count,currID,totalPrice,totalMoney,removeCartProductAll,loadingcart} = rootStore.cartStore;
  const { createOrder, editOrder, submitting, loadOrder,LatestOrderID,loadOrders999,orderCountReturn,loadingInitial } = rootStore.orderStore;
  const {usersRegistry,user,getUser,getUserID,createUserOrderNormal}= rootStore.userStore;
  const [order, setOrder] = useState(new OrderFormValues());
  const [loading, setLoading] = useState(false);
  const [noItem,setNoItem] = useState(true);
    var countState =0;
    const callback = (count:number) => {
      countState =count;
      // do something with value in parent component, like save to state
  }
  // const timeZone = 'Asia/Bangkok';
  const newID= orderCountReturn+1 ;
  console.log("new id: "+newID);
  const handleFinalFormSubmit =  async (values: any) => {
    const { ...order } = values;
    if (!order.id) {
      let newOrder = {
        ...order,
        id:String(newID),
        placementDate:moment().tz(timeZone).utc(),
        status:"NOPAYMENT",
        products:selectedCart?.products,
      };
      order.placementDate=moment().format("YYYY-MM-DD");
      order.placementDate+="T12:00:00";
      order.status="NOPAYMENT";
      newOrder.products.forEach((elemnt:IProduct ) => {
        elemnt.dateAdded = new Date( moment.utc(elemnt.dateAdded).valueOf());
        console.log(elemnt.dateAdded);
      });
       await createOrder(newOrder);
       await createUserOrderNormal(getUserID,newID.toString(),1);
       await removeCartProductAll(currID);
      history.push(`/payment/${newID}`)
    } else {
      editOrder(order);
    }
    //console.log(activity);
  };

  //   const { deleteProduct, submitting, targetDelete } = rootStore.productStore;
  var state;
  let history = useHistory();
  useEffect(() =>autorun(()=> {
    loadCart(getUserID);
    loadOrders999();})
  , [loadCart,loadOrders999]);

  if(cartCount!=0)
  {
    if(noItem)
    {
      setNoItem(false);
    }
  
  }
  console.log(noItem);
 // console.log("Total: "+totalMoney+","+totalPrice);
// console.log("latest Or ID:"+LatestOrderID);
  const handleChange = (e: any, value: any) => { state = { value } }
 // const History= useHistory();
  const timeZone = 'Asia/Bangkok';
  return (
    <Grid celled='internally'>
      <Grid.Row>
        <Grid.Column width={3}>

        </Grid.Column>
        <Grid.Column width={10}>
          <Grid.Row>
            <Segment padded>
              <a href="/"><p> &#10092; Browse other products</p>  </a>
              <Label attached="bottom right" > Current cart </Label>
            </Segment>
            <Segment padded>
              <FullCart parentCallBack={callback}>

              </FullCart>
            </Segment>
            <Segment padded>
              <Label>
               Customer information
               </Label>
               <FinalForm
            validate={validate}
            initialValues={order}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid}) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Label>Customer name</Label>
                <Field
                  name='recipientName'
                  placeholder='Name'
                  value={order.recipientName}
                  component={TextInput}
                />
                <Label>Deliver address</Label>
                <Field
                  name='recipientAddress'
                  placeholder='Address'
                  value={order.recipientAddress}
                  component={TextInput}
                />
                <Label>Recipent phone number</Label>
                <Field
                  name='recipientPhone'
                  placeholder='Phone'
                  value={parseInt(order.recipientPhone)}
                  component={NumberInput}
                />
                 <Form.Button
                  loading={submitting}
                  disabled={loading || invalid||noItem||loadingInitial}
                  floated='right'
                  positive
                  type='submit'
                  content='Create Order'
                />
                  <Form.Group>
                  <Form.Field >
                    <Label >
                      Total amount:
                    </Label>
                    <Label >
                      <Icon name="dollar sign">
                      </Icon>
                      {totalMoney}
                  </Label>
                  
                  </Form.Field>
                </Form.Group>
               
                
              </Form>
            )}
          />
              
                {/* <Form.Button fluid  >
                  Dat hang
               
                </Form.Button> */}
              
                {/* // onClick={() => History.push('/payment') */}
             
            </Segment>
          </Grid.Row>
        </Grid.Column>
        <Grid.Column width={3}>

        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default observer(CheckOut);
