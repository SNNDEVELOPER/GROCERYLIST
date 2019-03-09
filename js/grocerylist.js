(function() {

/*---------------------------------------------------------------------------------*/
/* VARIABLES ----------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------*/

let groceryList = [],
	errors = [],
	addQty = document.getElementById("add"),
	deleteItem = document.getElementById("delete"),
	output = document.getElementById("output"),
	send = document.getElementById("send"),
	emptyList = document.getElementById("emptyList");
	
/*---------------------------------------------------------------------------------*/
/* IIFE BUILD LIST ON LOAD --------------------------------------------------------*/
/*---------------------------------------------------------------------------------*/

!function() {
   buildList()
}()

/*---------------------------------------------------------------------------------*/
/* EVENT LISTENERS ----------------------------------------------------------------*/
/*---------------------------------------------------------------------------------*/

// DELETE BUTTON
deleteItem.addEventListener("click", function() { deleteItems() })

// SEND BUTTON
send.addEventListener("click", function() {makeTextFile(groceryList) })

// RESET BUTTON
emptyList.addEventListener("click", function() {
	if(groceryList.length > 0) {
		let conf = confirm("Are you sure you wish to clear the entire list?")
		if(conf) {
			localStorage.clear()
			buildList()
		}
	}
})

// ADD BUTTON
addQty.addEventListener("click", function(e) {
	let n = document.getElementById("item"),
 		g = document.getElementById("qty"),
 		isValid = validateForm()
	if(isValid) {
		groceryList.push({
			name: n.value,
			qty: parseInt(g.value),
			status: false
		})
		localStorage.setItem("groceryList", JSON.stringify(groceryList))
		groceryItem(g.value + ' + ' + n.value)
		// CLEAR OUR FORM
		document.getElementById("form").reset()
		buildList()
	}
})

/*---------------------------------------------------------------------------------*/
/* BUILD LIST ---------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------*/

function buildList() {
	// SEE IF LOCAL STORAGE IS SET OTHERWISE SET
	localStorage.getItem("groceryList") ? groceryList = JSON.parse(localStorage.getItem("groceryList")) : groceryList = []
 	
	// BUILD LIST OF EXISTING ITEMS
	let ul = document.createElement("ul")
	ul.setAttribute("id","list") // add ID attribute with value list
	let list = document.getElementById("output") // get our newly created list
	
	list.innerHTML = ""
	list.appendChild(ul)
	fadeIn(ul)
 	groceryList.forEach(function(item) {
 		let li = document.createElement("li")
	 
		li.classList.add("listItem")
		
 		ul.appendChild(li)
		
		if(item.status === true) {
			li.classList.add("selected") 
		}
		
 		li.innerHTML += "<h2>" + item.name + "</h2><p>" + item.qty + "</p>"
 	})
	
	// ADD CLICK EVENT FOR EACH LI
	selectItems();
}

/*---------------------------------------------------------------------------------*/
/* SELECT ITEMS -------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------*/

function selectItems() {
	 // BUILD ARRAY
	if(	groceryList.length <= 0 )  {
		output.innerHTML += "NO LIST ITEMS ADDED"
	} else {
		let listItems = Array.from(document.body.getElementsByTagName("li"))
		// FOR EACH LISTITEM ELEMENT APPEND EVENT LISTENER
		listItems.forEach(function(i,j,k) {
			i.addEventListener("click", function(e) {
				//  TOGGLE SELECTED
				i.classList.toggle("selected")
				// CHANGE STATUS IF TRUE FALSE IF FALSE TRUE
				groceryList[j].status = groceryList[j].status ? false : true;
				// APPEND TO LOCALSTORAGE
				localStorage.setItem("groceryList", JSON.stringify(groceryList))
			})
		}, false)
 	}
 }

/*---------------------------------------------------------------------------------*/
/* DELETE ITEMS -------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------*/

function deleteItems() {
	let selectItems = 0,
		plural;
	// GET TOTAL OF SELECTED ITEMS
 	for(let j = groceryList.length - 1; j >=0; --j) { 
		if(groceryList[j].status )
 		if(groceryList[j].status === true) {
 			selectItems += 1
 		}
	}
	// SELECTED ITEMS GREATER THAN 0
	if(selectItems != 0) {
		// ADJUST ITEM/S TEXT FOR CONFIRMATION
		selectItems > 1 ? plural = "items" : plural = "item"
		let conf = confirm("Are you sure you wish to delete " + selectItems + " "+ plural)
		// CONFIRMATION IS TRUE
		if(conf) {
			// REVERSE LOOP TO REMOVE ITEMS WITH TRUE STATUS
			for(let i = groceryList.length - 1; i >=0; --i) {
				groceryList[i].status === true ? groceryList.splice(i, 1) : ""
			}
			// UPDATE LOCAL STORAGE
			localStorage.setItem("groceryList", JSON.stringify(groceryList))
			// BUILD LIST
			buildList()
		}
	}
}

/*---------------------------------------------------------------------------------*/
/* FADE IN ------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------*/

function fadeIn(a) {
 	let fadeInc = function() {
 		a.style.opacity = +a.style.opacity + 0.01
		if(+a.style.opacity < 1) {
			setTimeout(fadeInc, 1)
		}
	}
 	fadeInc()
}

/*---------------------------------------------------------------------------------*/
/* VALIDATE FORM ------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------*/

function validateForm() {
// ERROR CHECK
	let formObj = {},
		formData = document.getElementById("form"),
		serialFormData = serializeArray(formData),
		formErrors = document.getElementsByClassName("formError")
		
	while(formErrors[0]) {
		formErrors[0].classList.remove("formError")
	}
	
	// SERIALIZE FORM DATA
	serialFormData.forEach(function(key, index) { 
		formObj[key.name] = key.value
	})
	
	// FIELDS FILLED OUT
	if(!formObj.item) errors.push("Name required.")
	if(!formObj.qty) errors.push("Quantity required.")

	// QTY IS NUMBER

	// SHOW ERRORS
	if(!formObj.item) document.getElementById("item").classList.add("formError")
	if(!formObj.qty) document.getElementById("qty").classList.add("formError")
	
	if(errors.length != 0) {
		return false
	} else {
		return true
	}
}

/*---------------------------------------------------------------------------------*/
/* BUILD GROCERY ITEM -------------------------------------------------------------*/
/*---------------------------------------------------------------------------------*/

function groceryItem(person) {
	output.innerHTML += '<div class="toggle" >' + person + ' </div>'
}

/*---------------------------------------------------------------------------------*/
/* BUILD TXT FILE -----------------------------------------------------------------*/
/*---------------------------------------------------------------------------------*/

function makeTextFile(b) {
	if(groceryList.length > 0) {
		let a = document.createElement("a")
		b.unshift({"name" : "Grocery List"}, {"date":""+getDate()+""})
		b = formatList(b)
		document.body.appendChild(a)
		a.style = "display: none"
		a.classList.add("hiddenLink")
		return function (data, fileName) {
			let json = JSON.stringify(data),
				blob = new Blob([b], {type: 'text/plain'})
				url = window.URL.createObjectURL(blob)
			a.href = url
			a.download = "groceryList.txt"
			a.click()
			window.URL.revokeObjectURL(url)
			let x = document.getElementsByClassName("hiddenLink")
			x[0].parentNode.removeChild(x[0])
		}()
	}
}

/*---------------------------------------------------------------------------------*/
/* FORMAT LIST --------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------*/

function formatList(c) {
	// STR VARIABLE TO HOLD OUR VALUES - TO BE OUTPUT IN OUR TXT FILE
	let str = ""
	// PLACE TITLE AND DATE FIRST
	str += c[0].name + " " + c[1].date + "\r\n\r\n"
	// LOOP OVER REMAINING OBJECT ADDING NAME AND QTY AND LINE BREAKS
	for(i = 2; i < c.length; i++) {
		str += c[i].name +  " " + c[i].qty + "\r\n"
	}
	// RETURN STRING
	return str
}

/*---------------------------------------------------------------------------------*/
/* GET DATE -----------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------*/

function getDate() {
	// NEW DATE
	let d = new Date()
	// BUILD DATE STRING
	let x = d.getUTCMonth()
	x += "-" + d.getUTCDay()
	x += "-" + d.getUTCFullYear()
	// RETURN DATE STRING
	return x
}

/*---------------------------------------------------------------------------------*/
// SERIALIZE ARRAY ----------------------------------------------------------------//
/*---------------------------------------------------------------------------------*/

function serializeArray(a) {
	let arr = []
	for (let i = 0; i < a.elements.length; i++) {
		let field = a.elements[i];

		// IGNORE UNIMPORTANT FIELDS - NAME, DISABLED, FILE, RESET, SUBMIT, BUTTON
		if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') continue // jump over the iteration

		// MULTIPLE FIELD TYPE
		if (field.type === 'select-multiple') {
			for (let j = 0; j < field.options.length; j++) {
				if (!field.options[j].selected) continue // jump over the iteration
				arr.push({
					name: field.name,
					value: field.options[j].value
				})
			}
		}

		// CONVERT FIELD DATA TO ARRAY
		else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
			arr.push({
				name: field.name,
				value: field.value
			})
		}
	}
	return arr
}
 
}())