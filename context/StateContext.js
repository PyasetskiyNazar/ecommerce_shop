import React, { createContext, useState, useEffect, useContext } from 'react'
import toast from 'react-hot-toast';

const Context = createContext()

export const StateContext = ({ children }) => {

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedStorageItems = JSON.parse(localStorage.getItem('cartItems'))
      const storedTotalPrice = +localStorage.getItem('totalPrice')
      const storedTotalQuantities = +localStorage.getItem('totalQuantities')

      if (storedStorageItems && storedStorageItems.length !== 0) {
        setCartItems(storedStorageItems)
        setTotalPrice(storedTotalPrice)
        setTotalQuantities(storedTotalQuantities)
      }
    }
  }, []);


  const [showCart, setShowCart] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalQuantities, setTotalQuantities] = useState(0)
  const [qty, setQty] = useState(1)


  let foundProduct
  let index


  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
    localStorage.setItem('totalPrice', JSON.stringify(totalPrice))
    localStorage.setItem('totalQuantities', JSON.stringify(totalQuantities))

  }, [cartItems]);

  const toggleCartItemQuanitity = (id, value) => {
    foundProduct = cartItems.find((item) => item._id === id)
    index = cartItems.findIndex((product) => product._id === id)
    const newCartItems = cartItems.filter((item) => item._id !== id)

    if (value === 'inc') {
      setCartItems([...newCartItems.slice(0, index),
      { ...foundProduct, quantity: foundProduct.quantity + 1 }, ...newCartItems.slice(index)])

      setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price)
      setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1)
    } else if (value === 'dec') {
      if (foundProduct.quantity > 1) {
        setCartItems([...newCartItems.slice(0, index),
        { ...foundProduct, quantity: foundProduct.quantity - 1 }, ...newCartItems.slice(index)])
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price)
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities - 1)
      }
    }
  }

  const onAdd = (product, quantity) => {
    const checkProductInCart = cartItems.find((item) => item._id === product._id)

    setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity)
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity)

    if (checkProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id === product._id) return {
          ...cartProduct,
          quantity: cartProduct.quantity + quantity
        }
      })
      setCartItems(updatedCartItems)
    } else {
      product.quantity = quantity
      setCartItems([...cartItems, { ...product }])
    }
    toast.success(`${qty} ${product.name} added to the cart.`)
  }

  const onRemove = (product) => {
    foundProduct = cartItems.find((item) => item._id === product._id)
    const newCartItems = cartItems.filter((item) => item._id !== product._id)

    setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity)
    setTotalQuantities(prevTotalQuantities => prevTotalQuantities - foundProduct.quantity)
    setCartItems(newCartItems)
  }

  const incQty = () => {
    setQty((prevQtq) => prevQtq + 1)
  }
  const decQty = () => {
    setQty((prevQtq) => {
      if (prevQtq - 1 < 1) {
        return 1
      }
      return prevQtq - 1
    })
  }

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        toggleCartItemQuanitity,
        onRemove,
        setCartItems,
        setTotalPrice,
        setTotalQuantities
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useStateContext = () => useContext(Context)
