const functions = require("firebase-functions");
const admin = require("firebase-admin");

var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const express = require("express");
const app = express();
const Profile = require('./profile');
const db = admin.firestore();
const cors = require("cors");
app.use(cors({origin:true}));

//Route

app.get('/',(req,res) => {
    return res.status(200).send("you can get/post/get by id/update and delete");
});

//create
app.post('/api/create',(req,res) => {
    (async () => {

        try {
            const data = req.body;
           await db.collection('profiles').doc().set(data);
            res.send('Record saved successfuly');
        } catch (error) {
            res.status(400).send(error.message);
        }

    })();
});
//read by specific
//get 
app.get('/api/read/:id',(req,res) => {
    (async () => {

        try {
            const id = req.params.id;
            const profile = await db.collection('profiles').doc(id);
            const data = await profile.get();
            if (!data.exists) {
                res.status(404).send('Profile with the given ID not found');
            } else {
                res.send(data.data());
            }
        } catch (error) {
            res.status(400).send(error.message);
        }

    })();
});


//read all product
//get 
app.get('/api/read',(req,res) => {
    (async () => {

        try {
            const profiles = await db.collection('profiles');
            const data = await profiles.get();
            const profilesArray = [];
            if (data.empty) {
                res.status(404).send('No profile record found');
            } else {
                data.forEach(doc => {
                    const profile = new Profile(
                        doc.id,
                        doc.data().name,
                        doc.data().ImgUrl,
                        doc.data().address,
                        doc.data().email,
                        doc.data().phone
                    );
                    profilesArray.push(profile);
                });
                res.send(profilesArray);
            }
        } catch (error) {
            res.status(400).send(error.message);
        }

    })();
});

//update
app.put('/api/update/:id',(req,res) => {
    (async () => {

        try {
            const id = req.params.id;
            const data = req.body;
            const profile = await db.collection('profiles').doc(id);
            await profile.update(data);
            res.send('Profile record updated Successfully');
        } catch (error) {
            res.status(400).send(error.message);
        }

    })();
});

//delete
app.delete('/api/delete/:id',(req,res) => {
    (async () => {

        try {
            const id = req.params.id;
            await db.collection('profiles').doc(id).delete();
            res.send('Record deleted Successfully');
        } catch (error) {
            res.status(400).send(error.message);
        }
    

    })();
});

//export Api to firebase cloud function
exports.app = functions.region("asia-southeast2").https.onRequest(app);