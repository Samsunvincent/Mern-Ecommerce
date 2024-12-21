exports.outOfStockNotification = function (sellerName, productName) {
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
                            background-color: #FF6F61;
                            color: white;
                            text-align: center;
                            padding: 10px 0;
                            border-radius: 8px 8px 0 0;
                        }
                        .content {
                            padding: 20px;
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
                            <h2>Out of Stock Notification</h2>
                        </div>
                        <div class="content">
                            <p>Hi ${sellerName},</p>
                            <p>We wanted to inform you that the following product is out of stock:</p>
                            <ul>
                                <li><b>Product:</b> ${productName}</li>
                            </ul>
                            <p>Please take appropriate action to update the stock or remove the product from your listings.</p>
                            <p>If you need any assistance, feel free to contact us.</p>
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
