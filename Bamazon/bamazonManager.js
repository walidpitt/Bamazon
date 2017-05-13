
var mysql = require("mysql");
var inquirer = require("inquirer");



var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    
    user: "root",

    
    password: "",
    database: "Bamazon"
});


connection.connect(function(err) {
    if (err) throw err;
});



let mainMenu = function() {

    inquirer.prompt([{
        type: 'list',
        name: 'mainMenu',
        message: 'Welcome to manager mode. What do you want to do?',
        choices: [
            'View Products for Sale',
            'View Low Inventory',
            'Add to Inventory',
            'Add New Product',
            'Quit'
        ]
    }, ]).then(function(answers) {
        if (answers.mainMenu === "View Products for Sale") {
            viewProducts()
        } else if (answers.mainMenu === "View Low Inventory") {
            viewLowInventory()
        } else if (answers.mainMenu === "Add to Inventory") {
            addInventory()
        } else if (answers.mainMenu === "Add New Product") {
            addNewProduct()
        } else if (answers.mainMenu === "Quit") {
        	connection.end();
        }
    });
}


mainMenu()
    


let viewProducts = function() {
    connection.query("SELECT * FROM products", function(error, results) {
        if (error) throw error;
        console.log("\n")
        console.log("=======================================")
        console.log("Here are the current products in stock:")
        console.log("=======================================")
        for (var i = 0; i < results.length; i++) {
            console.log(
                results[i].product_name + "\n" + " | " + "Product ID: " + results[i].item_id + "\n" + " | " + "Department Name: " + results[i].department_name + "\n" + " | " + "Price: " + "$" + results[i].price + "\n" + " | " + "Quantity: " + results[i].stock_quantity + "\n"
            );
        }
        inquirer.prompt([{
            name: "nextAction",
            type: "confirm",
            message: "Would you like to return to the main menu?"
        }]).then(function(answer) {
            if (answer.nextAction === true) {
                mainMenu()
            } else {
            	console.log("Quitting Application. Goodbye.")
                connection.end();
            }
        })
    });
}


let viewLowInventory = function() {
    connection.query("SELECT * FROM products", function(error, results) {
        if (error) throw error;
        console.log("\n")
        console.log("=======================================")
        console.log("Attention! These products are low in stock:")
        console.log("=======================================")
        for (var i = 0; i < results.length; i++) {
            if (results[i].stock_quantity <= 100) {
                console.log(
                    results[i].product_name + "\n" + " | " + "Product ID: " + results[i].item_id + "\n" + " | " + "Department Name: " + results[i].department_name + "\n" + " | " + "Price: " + "$" + results[i].price + "\n" + " | " + "Quantity: " + results[i].stock_quantity + "\n"
                );
            }
        }
        inquirer.prompt([{
            name: "nextAction",
            type: "confirm",
            message: "Would you like to return to the main menu?"
        }]).then(function(answer) {
            if (answer.nextAction === true) {
                mainMenu()
            } else {
                console.log("Quitting Application. Goodbye.")
                connection.end();
            }
        })
    });
}



let addInventory = function() {
    connection.query("SELECT * FROM products", function(error, results) {
        if (error) throw error;
        console.log("\n")
        console.log("=======================================")
        console.log("Here is the current stock:")
        console.log("=======================================")
        for (var i = 0; i < results.length; i++) {
            console.log(
                results[i].product_name + "\n" + " | " + "Product ID: " + results[i].item_id + "\n" + " | " + "Department Name: " + results[i].department_name + "\n" + " | " + "Price: " + "$" + results[i].price + "\n" + " | " + "Quantity: " + results[i].stock_quantity + "\n"
            );
        }
        inquirer.prompt([{
            type: 'input',
            name: 'idPick',
            message: 'Enter the ID of the product you would like to add to:'
        }, {
            type: 'input',
            name: 'quantity',
            message: 'How many units would you like to add?'
        }]).then(function(answer) {
            var item = "";
            var numberOf = answer.quantity;
            for (var i = 0; i < results.length; i++) {
                if (answer.idPick == results[i].item_id) {
                    item = results[i]
                }
            }

            connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: item.stock_quantity + parseInt(numberOf)
            }, {
                item_id: item.item_id
            }], function(error) {
                if (error) throw error;
                console.log("\n" + "Success, " + item.product_name + " has been updated to have a total of (" + (item.stock_quantity + parseInt(numberOf)) + ") units")
                inquirer.prompt([{
                    name: "nextAction",
                    type: "confirm",
                    message: "Would you like to return to the main menu?"
                }]).then(function(answer) {
                    if (answer.nextAction === true) {
                        mainMenu()
                    } else {
                        console.log("Quitting Application. Goodbye.")
                        connection.end();
                    }
                })
            });
        })
    });
}



let addNewProduct = function() {
    inquirer.prompt([{
        name: "product",
        type: "input",
        message: "What is the name of the product?"
    }, {
        name: "department",
        type: "input",
        message: "What department does this item belong to?"
    }, {
        name: "price",
        type: "input",
        message: "What is the unit price of this item?"
    }, {
        name: "stock",
        type: "input",
        message: "How many units are currently in stock?"
    }]).then(function(answers) {
        connection.query("INSERT INTO products SET ?", {
            product_name: answers.product,
            department_name: answers.department,
            price: answers.price,
            stock_quantity: parseInt(answers.stock)
        }, function(error, res) {
            if (error) throw error;
            console.log("Success! Database has been updated.")
            inquirer.prompt([{
                name: "nextAction",
                type: "confirm",
                message: "Would you like to return to the main menu?"
            }]).then(function(answer) {
                if (answer.nextAction === true) {
                    mainMenu()
                } else {
                    console.log("Quitting Application. Goodbye.")
                    connection.end();
                }
            })
        });
    })
}
