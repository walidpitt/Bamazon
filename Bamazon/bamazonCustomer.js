
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



var start = function() {

   
    connection.query("SELECT * FROM products", function(error, results) {
        if (error) throw error;
        console.log("\n")
        console.log("==========================")
        console.log("Current Products in Stock:")
        console.log("==========================")
        for (var i = 0; i < results.length; i++) {
            console.log(
                results[i].product_name + "\n" + " | " + "Product ID: " + results[i].item_id + "\n" + " | " + "Department Name: " + results[i].department_name + "\n" + " | " + "Price: " + "$" + results[i].price + "\n" + " | " + "Quantity: " + results[i].stock_quantity + "\n"
            );
        }

        var stock = results

      
        inquirer.prompt([{
                type: 'input',
                name: 'idPick',
                message: "\n" + "Welcome to bamazon!" + "\n" + "Check out our latest products above!" + "\n" + "Enter the ID of the product you would like to purchase:"
            }, {
                type: 'input',
                name: 'quantity',
                message: 'How many units would you like to purchase?'
            }])
            .then(function(answers) {
               
                var userItem = "";
                var userNumberItems = answers.quantity;
                for (var i = 0; i < stock.length; i++) {
                    if (answers.idPick == stock[i].item_id) {
                        userItem = stock[i]
                        
                    }
                }
                
                if (answers.quantity > userItem.stock_quantity) {
                    console.log("\n" + "We currently dont have that many in stock. Please check back later. " + "Redirecting you to the storefront:")
                    start();

                  
                } else {
                    inquirer.prompt([{
                        type: 'confirm',
                        name: 'purchaseConfirm',
                        message: "You would like to purchase " + "(" + answers.quantity + ") " + "of " + "(" + userItem.product_name + ")" + ". " + "Please confirm:"
                    }]).then(function(answer) {
                        
                        
                        if (answer.purchaseConfirm == true) {
                            connection.query("UPDATE products SET ? WHERE ?", [{
                              stock_quantity: userItem.stock_quantity - userNumberItems
                            }, {
                              item_id: userItem.item_id
                            }], function(error) {
                              if (error) throw error;               
                              
                              console.log("\n" + "Your total is $" + (userItem.price * userNumberItems))
                              console.log("\n"  +'Congratulations on your purchase. Your item(s) are being processed. Please come back soon!' + "\n")
                            connection.end();
                            });        

                        
                        } else {
                            inquirer.prompt([{
                                name: "nextAction",
                                type: "confirm",
                                message: "Looks like you changed your mind. Would you like to return to the storefront?"
                            }]).then(function(answer) {
                                if (answer.nextAction === true) {
                                    start()
                                } else {
                                    console.log("Quitting Application. Goodbye.")
                                    connection.end();
                                }
                            })
                        }
                    })
                }
            });
    });
};


start() 
