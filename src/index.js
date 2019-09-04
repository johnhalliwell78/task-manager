const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000;
//
// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET request are disabled');
//     } else {
//         next();
//     }
// });


// next function : that's specific to registering middleware to get started
// Postman luoon loading, phair hoanf thanhf mọi thứ ở middleware trước khi chạy vào bên trong
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

// without middleware = new request -> run route handler
// with middleware = new request -> do something -> run route handler

app.listen(port, () => {
    console.log('Server is running up on port', port);
});


