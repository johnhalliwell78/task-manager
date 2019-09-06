const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const multer = require('multer');

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

// const Task = require('./models/task');
// const main = async () => {
//     // const task = await Task.findById('5d6fb794fb24c933b403aaf9');
//     // console.log(task);
//     const user = await User.findById('5d69240906bad338b87233a9');
//     await user.populate('tasks').execPopulate();
//     console.log(user.tasks);
// };
// main();

// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(doc|docx)$/)) {
//             return cb(new Error('Please upload a pdf'));
//         }
//         cb(undefined, true);
//
//         /*
//         cb(new Error('File must be a PDF')
//         cb(undefined, true)
//         cb(undefined, false)
//          */
//     }
// });
// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send();
// }, (error, req, res, next) => {
//     res.status(404).send({error: error.message});
// });

