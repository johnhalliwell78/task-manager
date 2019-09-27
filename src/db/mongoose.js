const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});



//
//
// const me = new User({
//     name: 'John  ',
//     email: 'nam@gmail.com   '
// });
//
// me.save().then(() => {
//     console.log('Done Saving!');
//     console.log(me);
// }).catch((error) => {
//     console.log('Error', error);
// });

// const Task = new mongoose.models('task', {
//     description: {
//         type: String,
//         required: true
//     },
//     completed: {
//         type: Boolean,
//         validate(value) {
//             if (value < 0) {
//                 throw new Error('Age Must Be A Positive Number');
//             }
//         }
//     }
// });
