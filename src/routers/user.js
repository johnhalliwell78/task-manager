const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();
const multer = require('multer');
const {sendWelcomeEmail} = require('../emails/account');
const sharp = require('sharp');


router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.send({user: user, token: token});
    } catch (e) {
        res.status(400).send(e);
    }
    // user.save().then(() => {
    //     res.status(201).send(user);
    // }).catch((error) => {
    //     res.status(400).send(error);
    // });
});

router.post('/users/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        // res.send({user: user.getPublicProfile(), token: token});
        res.send({user: user, token: token});
    } catch (e) {
        res.status(400).send(e);
    }
});

// Two Option to hide private data:
// use your own method created in model
// use toJSON function to auto hide

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
        console.log(e);
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
});

// route login sẽ generate token và lưu vào mỗi lần login

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});
// middle được truyền vào như là second argument trong các rest api function

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        res.status(500).send(e);
    }
    // User.findById(_id).then((user) => {
    //     if (!user) {
    //         return res.status(404).send();
    //     }
    //
    //     res.send(user);
    // }).catch((error) => {
    //     res.status(500).send(error);
    // });
});
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    });

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid Updates'});
    }

    try {
        const user = req.user;
        updates.forEach((update) => {
            req.user[update] = req.body[update];
        });
        await req.user.save();
        // const user = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true});
        // if (!user) {
        //     res.status(404).send();
        // }
        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});
// router.patch('/users/:id', async (req, res) => {
//     const updates = Object.keys(req.body);
//     const allowedUpdates = ['name', 'email', 'password', 'age'];
//     const isValidOperation = updates.every((update) => {
//         return allowedUpdates.includes(update)
//     });
//
//     if (!isValidOperation) {
//         return res.status(400).send({error: 'Invalid Updates'});
//     }
//
//     const _id = req.params.id;
//     try {
//         const user = await User.findById(_id);
//         updates.forEach((update) => {
//             user[update] = req.body[update];
//         });
//         await user.save();
//         // const user = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true});
//         if (!user) {
//             res.status(404).send();
//         }
//         res.send(user);
//     } catch (e) {
//         res.status(400).send(e);
//     }
// });


// router.delete('/users/:id', async (req, res) => {
//     const _id = req.params.id;
//     try {
//         const user = await User.findByIdAndDelete(_id);
//         if (!user) {
//             return res.status(404).send();
//         }
//         res.send(user);
//     } catch (e) {
//         res.status(500).send(e);
//     }
// });

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id);
        // if (!user) {
        //     return res.status(404).send();
        // }
        await req.user.remove();
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }
});

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a image'));
        }
        cb(undefined, true);

        /*
        cb(new Error('File must be a PDF')
        cb(undefined, true)
        cb(undefined, false)
         */
    }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    console.log(req.file.buffer);
    // req.file.buffer  tồn tại khi không có option dest trong multer
    res.send(req.file.buffer);
}, (error, req, res, next) => {
    res.status(404).send({error: error.message});
});

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});

router.get('/users/:id/avatar', async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findById(_id);
        if (!user || !user.avatar) {
            throw new Error();
        }
// to send image, we have to set response header
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
});

module.exports = router;