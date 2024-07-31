const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const midtransClient = require('midtrans-client');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Midtrans configuration
const coreApi = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: 'your-server-key',
    clientKey: 'your-client-key'
});

const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: 'your-server-key',
    clientKey: 'your-client-key'
});

app.post('/', (req, res) => {
    const order_id = req.body.order_id;
    const gross_amount = req.body.gross_amount;
    const customer_details = req.body.customer_details;
    const item_details = req.body.item_details;

    const parameter = {
        transaction_details: {
            order_id: order_id,
            gross_amount: gross_amount
        },
        credit_card: {
            secure: true
        },
        customer_details: customer_details,
        item_details: item_details
    };

    snap.createTransaction(parameter)
        .then((transaction) => {
            const transactionToken = transaction.token;
            res.json({ snapToken: transactionToken });
        })
        .catch((e) => {
            res.status(500).send({
                message: "Something went wrong",
                error: e.message
            });
        });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
