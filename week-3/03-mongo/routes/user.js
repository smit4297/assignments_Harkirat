const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User } = require("../db");

// User Routes
router.post('/signup',async (req, res) => {
    // Implement user signup logic
    try{

        const username = req.body.username;
        const password = req.body.passowrd;

        if(!username || !password){
            res.send("username/password is empty");
            return;
        }

        const dbUsername = await User.findOne({username : username});
        if(dbUsername){
            res.status(401).send("username already exists");
            return;
        }else{
            const user = new User({ username, password});
            const savedUser = await user.save();
            res.status(200).json({message: 'User created successfully'});
        }

    }catch(e){
        console.error("Error in userSignup", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/courses',async (req, res) => {
    // Implement listing all courses logic
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    try {
        const courseId = req.params.courseId;
        // Check if the course exists
        const course = await Course.findOne({ _id: courseId });
        if (!course) {
            res.status(404).send("Course with ID " + courseId + " not found");
            return;
        }
        // Get the user from the middleware
        const user = await User.findOne({username: req.headers.username});
        // Check if the course is already in the user's courses
        const isCourseAlreadyPurchased = user.courses.includes(courseId);
        if (isCourseAlreadyPurchased) {
            res.status(400).send("Course already purchased");
            return;
        }
        // Update the user's courses array with the new purchase
        user.courses.push(courseId);
        // Save the updated user document
        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error purchasing course:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/purchasedCourses', userMiddleware,async (req, res) => {
    // Implement fetching purchased courses logic
    try{
        const user = await User.findOne({username: req.headers.username});
        const purchasedCourse = user.courses;
        res.json({ purchasedCourses: purchasedCourse});
    }catch (error) {
        console.error('Error fetching purchased course:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router