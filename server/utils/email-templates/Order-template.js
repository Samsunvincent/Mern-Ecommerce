exports.order = function (name, orderDetails) {
    return new Promise((resolve, reject) => {
        try {
            const template = `
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                            background-color: #f4f4f4;
                        }
                        .container {
                            margin: 20px auto;
                            padding: 20px;
                            background-color: #ffffff;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                            max-width: 600px;
                        }
                        .header {
                            background-color: #48BA81;
                            color: white;
                            text-align: center;
                            padding: 10px 0;
                            border-radius: 8px 8px 0 0;
                        }
                        .content {
                            padding: 20px;
                        }
                        ul {
                            padding-left: 20px;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            font-size: 0.8em;
                            color: #777;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Order Confirmation</h2>
                        </div>
                        <div class="content">
                            <p>Hi ${name},</p>
                            <p>Thank you for your order! Here are your order details:</p>
                            <ul>
                                ${orderDetails
                                    .map(
                                        item => `
                                            <li>
                                                ${item.productName} - $${item.productPrice.toFixed(2)} 
                                                x ${item.quantity} = $${item.totalPrice.toFixed(2)}
                                            </li>
                                        `
                                    )
                                    .join("")}
                            </ul>
                            <p><b>Total Amount:</b> $${orderDetails.reduce((acc, item) => acc + item.totalPrice, 0).toFixed(2)}</p>
                            <p>If you have any questions, feel free to contact us.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2024 Your Company. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>`;
            resolve(template);
        } catch (error) {
            reject(error);
        }
    });
};
    