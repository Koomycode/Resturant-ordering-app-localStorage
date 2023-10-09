import { menuArray } from "./data.js"

const menuSection = document.getElementById("menu-section")
const orderContainer = document.getElementById("order-container")
const totalPrice = document.getElementById("total-price")

const bigImgContainer = document.getElementById("big-img-container")

const checkOutSection = document.getElementById("check-out-section")
const payForm = document.getElementById("pay-form")

let orderesArray = []

const savedOrders = JSON.parse(localStorage.getItem("orders"))
if (savedOrders) {
    orderesArray = savedOrders
    renderOrders(orderesArray)
}

function createMenuHTML(dataArray) {
    return dataArray.map(item => {
        const { name, ingredients, price, id, img } = item

        return `
        <div class="food-container flex">
            <img src="${img}" class="food-img" data-img="${id}">
        
            <div class="food-discribtion flex">
                <h2 class="food-name">${name}</h2>
                <p class="food-ing">${ingredients.join(', ')}</p>
                <p class="food-price">${price}</p>
            </div>
        
            <button class="add" >
                <i class="fa-solid fa-circle-plus" data-add-order="${id}"></i>
            </button>
        </div> 
        `

    }).join("")
}

function renderMenu(dataArray) {
    menuSection.innerHTML += createMenuHTML(dataArray)
}

renderMenu(menuArray)

// ---------------- App Click Functions ----------------

document.addEventListener("click", function (e) {
    if (e.target.dataset.addOrder) {
        handleAddClick(e.target.dataset.addOrder)
    }

    if (e.target.dataset.removeOrder) {
        handleRemoveClick(e.target.dataset.removeOrder)
    }

    bigImgContainer.style.display = "none"

    if (e.target.dataset.img) {
        handleImgClick(e.target.dataset.img)
    }

    if (e.target.id === "place-order") {
        handlePlaceOrder()
    }

    if (e.target.id === "close-form") {
        handleCloseClick()
    }


})



function handleAddClick(dataID) {
    const currentData = menuArray.filter(item => {
        return item.id === dataID
    })[0]

    const currentDataObject = {
        name: currentData.name,
        price: currentData.price,
        id: 0
    }

    orderesArray.push(currentDataObject)


    const doplicate = orderesArray.some(item => item.id === currentDataObject.id)
    if (doplicate) {
        const maxIdNum = Math.max(...orderesArray.map(item => item.id))
        currentDataObject.id = (maxIdNum + 1).toString()
    }

    localStorage.setItem("orders", JSON.stringify(orderesArray))

    renderOrders(orderesArray)
}



function handleRemoveClick(dataID) {
    const currentData = orderesArray.filter(item => item.id === dataID)[0]

    orderesArray = orderesArray.filter(item => item !== currentData)

    localStorage.setItem("orders", JSON.stringify(orderesArray))

    renderOrders(orderesArray)
}



function handleImgClick(dataID) {
    const currentData = menuArray.filter(item => item.id === dataID)[0]

    const bigImg = `<img src="${currentData.img}" class="big-img">`

    renderBigImg(bigImg)
}



function handlePlaceOrder() {
    checkOutSection.style.display = "flex"
}

function handleCloseClick() {
    checkOutSection.style.display = "none"
    restoreFormHtml()

}

payForm.addEventListener("submit", function (e) {
    e.preventDefault()
    finishPayOrder()
})

function finishPayOrder() {
    checkOutSection.innerHTML = `
    <i class="fa-solid fa-circle-xmark close-form" id="close-form"></i>
    <h4>Your order is on the way</h4>
    <img src="./images/giphy.gif" class="on-the-way"> 
    `
}

function restoreFormHtml() {
    checkOutSection.innerHTML = `
    <i class="fa-solid fa-circle-xmark close-form" id="close-form"></i>
    <form id="pay-form" action="submit" class="flex">
        <h4>Enter your card details</h4>
        <input 
            type="text" 
            name="name" 
            id="name" 
            placeholder="Enter your name" 
            required>
        <input 
            type="text" 
            name="card-number" 
            id="card-number" 
            placeholder="Enter your card number" 
            required>
        <input 
            type="text" 
            name="CVV" 
            id="CVV" 
            placeholder="Enter CVV" 
            required>
        <button type="submit" class="pay" id="pay">Pay</button>
    </form>
    `
}


function renderBigImg(data) {
    bigImgContainer.style.display = "block"
    bigImgContainer.innerHTML = data
}

function createOrderHTML(dataArray) {
    return dataArray.map(item => {
        const { name, price, id } = item
        return `
        <div class="order-box flex">
            <p class="order-name">
                ${name} 
                <span class="remove" data-remove-order="${id}">( Remove )</span>
            </p>
            <p class="order-price">
                $${price}
            </p>
        </div>
        `
    }).join("")
}

function renderOrders(dataArray) {
    orderContainer.innerHTML = createOrderHTML(dataArray)

    const totalPriceNum = dataArray.reduce((total, current) => {
        return total + current.price
    }, 0)

    totalPrice.textContent = `$${totalPriceNum}`
}