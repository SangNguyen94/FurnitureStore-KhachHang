import React, { useContext, useEffect, useCallback, useReducer } from 'react';
import { Button, Label, Table, Icon, Card, Image, Grid, GridRow, Segment, Form, Radio, Item } from 'semantic-ui-react';
import { Link, useHistory, RouteComponentProps } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { format, zonedTimeToUtc } from 'date-fns-tz';
import { IProduct } from '../../app/models/product';
import FullCart from './FullCart';
import CartItemSmall from './CartItemSmall';
import { loadStripe } from '@stripe/stripe-js';

const options = [
  { key: 'm', text: 'Nam', value: 'male' },
  { key: 'f', text: 'Nu', value: 'female' },
  { key: 'o', text: 'Khac', value: 'other' },
]
const orderOption = [
  { key: 'h', text: 'Giao tan noi', value: 'deliver' },
  { key: 'os', text: 'Nhan tai cua hang', value: 'onsite' },

]

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'useEffectUpdate':
      return {
        ...state,
        ...action.payload,
        price: formatPrice(
          action.payload.unitAmount,
          action.payload.currency,
          state.quantity,
        ),
      };
    case 'increment':
      return {
        ...state,
        quantity: state.quantity + 1,
        price: formatPrice(
          state.unitAmount,
          state.currency,
          state.quantity + 1,
        ),
      };
    case 'decrement':
      return {
        ...state,
        quantity: state.quantity - 1,
        price: formatPrice(
          state.unitAmount,
          state.currency,
          state.quantity - 1,
        ),
      };
    case 'setLoading':
      return { ...state, loading: action.payload.loading };
    case 'setError':
      return { ...state, error: action.payload.error };
    default:
      throw new Error();
  }
}
interface DetailParams {
  id: string;
}

const fetchCheckoutSession = async (quantity: number[], image: string[], currency: string[], productID: string[], unitAmount: number[]) => {
  // return fetch('http://localhost:14640/FurnitureStore/rest/payment/create-checkout-session', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
    return fetch('http://ec2-13-228-71-245.ap-southeast-1.compute.amazonaws.com:8080/FurnitureStore-1.0/rest/payment/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      quantity,
      image,
      currency,
      productID,
      unitAmount
    }),
  }).then((res) => res.json());
};

const formatPrice = (amount: number, currency: string, quantity: number) => {
  const numberFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
  });
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;
  for (let part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false;
    }
  }
  amount = zeroDecimalCurrency ? amount : amount / 100;
  const total = (quantity * amount).toFixed(2);
  return total;
};
const currencyVND = "vnd";
interface PriceData {
  currency: string,
  product: string,
  unitAmount: number
}

// class PD implements PriceData {
//   currency:string;
//   product:string;
//   unitAmount:number;

// }

const src = 'assets/ORIGINAL.jpg'
const Payment: React.FC<RouteComponentProps<DetailParams>> = ({ match, history }) => {
  const [state, dispatch] = useReducer(reducer, {
    quantity: 1,
    price: null,
    loading: false,
    error: null,
    stripe: null,
  });
  const rootStore = useContext(RootStoreContext);
  const { cartCount, loadCart, getCart, cartRegistry, selectedCart, currentCart, totalPrice } = rootStore.cartStore;
  const { loadOrder, currentOrder, editOrder, totalMoney, totalPriceCurrentOrder, loadOrders } = rootStore.orderStore;
  // var history=useHistory();
  let directPayment = false;
  const handlePayment = () => {
    if (!directPayment) {
      handleClick();
    }
    else {
      var newOrder = currentOrder;
      if (newOrder) {
        newOrder.status = "Delivering";
      }
      editOrder(newOrder!);
    }
  }


  const handleClick = async () => {


    let quantity: number[] = new Array(currentOrder?.products.length);
    let image: string[] = new Array(currentOrder?.products.length);
    let currency: string[] = new Array(currentOrder?.products.length);
    let productID: string[] = new Array(currentOrder?.products.length);
    let unitAmount: number[] = new Array(currentOrder?.products.length);
    currentOrder?.products.forEach((product, index) => {

      quantity[index] = product.quantity;
      image[index] = product.product.image;
      currency[index] = currencyVND;
      productID[index] = product.product.name;
      unitAmount[index] = product.product.price;

    })
    // Call your backend to create the Checkout session.
    dispatch({ type: 'setLoading', payload: { loading: true } });
    const { sessionId } = await fetchCheckoutSession(
      quantity, image, currency, productID, unitAmount
    );
    // When the customer clicks on the button, redirect them to Checkout.
    const { error } = await state.stripe.redirectToCheckout({
      sessionId,
    });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    if (error) {
      dispatch({ type: 'setError', payload: { error } });
      dispatch({ type: 'setLoading', payload: { loading: false } });
    }
  };
  //   const { deleteProduct, submitting, targetDelete } = rootStore.productStore;
  useEffect(() => {
    async function fetchConfig() {
      // Fetch config from our backend.
      // const { publicKey, unitAmount, currency } = await fetch(
      //   'http://ec2-13-229-47-48.ap-southeast-1.compute.amazonaws.com:8080/FurnitureStore-1.0/rest/payment/config'
      // ).then((res) => res.json());
      const { publicKey, unitAmount, currency } = await fetch(
        'http://localhost:14640/FurnitureStore/rest/payment/config'
      ).then((res) => res.json());
      // Make sure to call `loadStripe` outside of a component’s render to avoid
      // recreating the `Stripe` object on every render.
      dispatch({
        type: 'useEffectUpdate',
        payload: { unitAmount, currency, stripe: await loadStripe(publicKey) },
      });
    }
    fetchConfig();
    loadOrder(match.params.id);
  }, [loadOrder]);
  console.log(totalMoney);
  // var state;
  // const handleChange = (e: any, value: any) => { state = { value } }

  const timeZone = 'Asia/Bangkok';
  return (
    <Grid celled='internally'>
      <Grid.Row>
        <Grid.Column width={3}>

        </Grid.Column>
        <Grid.Column width={10}>
          <Grid.Row>
            <Segment textAlign="center" >
              <Icon name="shopping bag" color="green" >

              </Icon>
              <Label  > Order succeeded </Label>
            </Segment>
            <Segment >
              <p>
                Thank you for buying our products. A sale employee will contact you in 15 minutes to inquire details about this order
              </p>
            </Segment>
            <Segment >
              <Label>
                Order: {match.params.id}
              </Label>
              <br />
              <Label >
                <Icon name="dot circle">

                </Icon>
                   Customer name: <b> {currentOrder?.recipientName}</b>
              </Label>

              <br />
              <Label >
                <Icon name="dot circle">

                </Icon>
                 Deliver address: <b>  {currentOrder?.recipientAddress}</b>
              </Label>

              <br />
              <Label>
                <Icon name="dot circle">

                </Icon>
                 Total amount: <b style={{ color: "red" }}>  ${totalMoney}</b>
              </Label>

            </Segment>
            <Segment textAlign="center">
              <Label attached="top left">
                Choose your payment method
              </Label>
              <Button.Group fluid compact size="large" widths="10">
                <Button color="green" onClick={() => { directPayment = true; }}>Pay with cash</Button>
                <Button color="green" onClick={() => { directPayment = true; }}>Pay with physical card</Button>
              </Button.Group>
              <br />
              <Button.Group fluid compact size="large" widths="10">
                <Button color="blue" onClick={() => { directPayment = false; }}>Pay with online visa</Button>
              </Button.Group>

            </Segment>
            <Segment >
              <Label attached="top left">
                These products will be deliver within 2-4 business days
              </Label>
              <Segment raised>
                <Item.Group>
                  {currentOrder?.products?.map((product, index) => (
                    <CartItemSmall key={index + 1} ProductDTO={product.product} quantity={product.quantity} />))}
                </Item.Group>
              </Segment>
              <label>
                Total amount:
              </label>
              <p style={{ color: "red" }}>
                {totalMoney}
              </p>
              <Button color="orange" fluid onClick={handlePayment}>
                Finalizing payment and return to home page.
              </Button>
            </Segment>
          </Grid.Row>
        </Grid.Column>
        <Grid.Column width={3}>

        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default observer(Payment);
