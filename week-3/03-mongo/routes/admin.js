const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const bodyParser = require('body-parser');
const { User, Admin, Course } = require("../db");

router.use(bodyParser.json());

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
   
    try{

        const username = req.body.username;
        const password = req.body.passowrd;

        if(!username || !password){
            res.send("username/password is empty");
            return;
        }

        const dbUsername = await Admin.findOne({username : username});
        if(dbUsername){
            res.status(401).send("username already exists");
            return;
        }else{
            const admin = new Admin({ username, password});
            const savedAdmin = await admin.save();
            res.status(200).json({message: 'Admin created successfully'});
        }

    }catch(e){
        console.error("Error in adminSignup", error);
        res.status(500).send("Internal Server Error");
    }
    
});

router.post('/courses', adminMiddleware,async (req, res) => {
    try{

        const {title, description, price, imageLink} = req.body;

        if(!title || !description || !price || !imageLink){
            res.send("some fields are empty");
            return;
        }
            const course = new Course({ title, description, price, imageLink, Output, courseId});
            const savedCourse = await course.save();
            const courseId = savedCourse._id;
            res.status(200).json({message: 'Course created successfully', courseId: courseId});
        

    }catch(e){
        console.error("Error in adminSignup", error);
        res.status(500).send("Internal Server Error");
    }
    
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;