import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "react-apollo";
import GET_PRODUCT from "../graphql/getProductBySku.graphql";
import UPDATE_CART from "../graphql/updateCart.graphql";
import { useCssHandles } from "vtex.css-handles";
import "../styles/style.css";

const QuickOrder = () => {
  const [getProductData, {data: product}] = useLazyQuery(GET_PRODUCT);
  const [addToCart] = useMutation(UPDATE_CART);
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("");
  const [notFoundProduct, setNotFoundProduct] = useState("");

  const style = [
    "container__quick-order",
    "title__quick-order",
    "form__quick-order",
    "button__quick-order",
    "label__quick-order",
    "notFound__quick-order"
  ]

  const handle = useCssHandles(style);

  const handleChange = (evento: any) => {
    setInputText(evento.target.value);
  }

  const searchProduct = (evento: any) => {
    evento.preventDefault();
      if(!inputText) {
        setNotFoundProduct("Ingrese un sku primero.");
      } else {
        setSearch(inputText);
        getProductBySku();
      }
  }

  const updateAddToCart = (productId: string) => {
    const skuId = parseInt(productId);
     addToCart({
      variables: {
        salesChannel: "1",
        items: [
          {
            id: skuId,
            quantity: 1,
            seller: "1"
          }
        ]
      }
    })
    .then(() => {
      window.location.href = "/checkout";
    })
  }

  const getProductBySku = () => {
    getProductData({
      variables: {
        sku: inputText
      }
    }) 
  }

  useEffect(() => {
    if(search === "") {
      return;
    }
    if(product) {
        updateAddToCart(product?.product?.productId);
    } else {
      setNotFoundProduct("No existe el producto, ingresado.");
    }
  },[search, product]);

  return (
    <div className={handle["container__quick-order"]}>
      <h2 className={handle["title__quick-order"]}>Compra super rápida</h2>
      <form onSubmit={searchProduct} className={handle["form__quick-order"]}>
          <label htmlFor="sku" className={handle["label__quick-order"]}>Ingrese su sku 👇</label>
          <input 
            id="sku"
            type="text"
            placeholder="Producto a Buscar"
            onChange={handleChange}
            />
            <button className={handle["button__quick-order"]}>Añadir al carrito</button>
      </form>
      {
        notFoundProduct &&
        <h4 className={handle["notFound__quick-order"]}>{notFoundProduct}</h4>
      }
    </div>
  )
};

export default QuickOrder;