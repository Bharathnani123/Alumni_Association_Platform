const express = require("express")
const app = express()
const session = require('express-session');

const router = express.Router();
const path = require("path")
const hbs = require("hbs")
const collection = require("./model")
const collect = require("./Smodel")
const JobPost = require("./jobP")
const Chat = require("./connectA")
const Events = require("./Emodel")
//send message
const Message = require("./studentNotify")
const MessageA = require("./AlumniNotify")
const MessageS = require("./StaffNotify")
//feedback
const Feedback = require("./Feed")
// latest Events
const Update = require("./latestU")
//Live LOcation
const AlumniLocation = require("./Local")
//Displaying Acheivements
const Achievement = require("./displayAcheive")
//Gallery
const AlumniGallery = require("./Images")
//mentorship
const MentorshipRequest = require("./MentorS")
const Mentor = require("./MentorA")
//Group
const group = require("./groups")

const templatepath = path.join(__dirname, '../templates')
const publicpath = path.join(__dirname, '../public')
console.log(publicpath)
const keypath = path.join(__dirname, '../keys')
console.log(keypath)
app.use(express.json())
app.set("view engine", "hbs")
app.set("views", templatepath)
app.use(express.urlencoded({ extended: false }))
app.use(express.static(publicpath))
app.use(express.static(keypath))

app.use(session({
    secret: 'your-secret-key',   // Replace with a strong secret key
    resave: false,               // Don't save session if unmodified
    saveUninitialized: true,     // Save a session that is new, but hasn't been modified
    cookie: { secure: false }    // Set to true if using HTTPS
}));



app.get("/", (req, res) => {
    res.render("home")
})
app.get("/Register", (req, res) => {
    res.render("Register")
})
app.get("/AlumniJob", (req, res) => {
    res.render("AlumniJob")
})

app.get("/overview", (req, res) => {
    res.render("overview")
})
app.get("/payments", (req, res) => {
    res.render("payments")
})
app.get("/Login", (req, res) => {
    res.render("Login")
})

app.get("/twoStep", (req, res) => {
    res.render("twoStep")
})
app.get("/jobposting", (req, res) => {
    res.render("jobposting")
})

app.get("/AdministratorHome", (req, res) => {
    res.render("AdministratorHome")
})
app.get("/AlumniHome", (req, res) => {
    res.render("AlumniHome")
})

app.get("/staffHome", (req, res) => {
    res.render("staffHome")
})
app.get("/StudentHome", (req, res) => {
    res.render("StudentHome")
})

app.get("/purpose", (req, res) => {
    res.render("purpose")
})
app.get("/presidents", (req, res) => {
    res.render("presidents")
})
app.get("/connect", (req, res) => {
    res.render("connect")
})

app.get("/EventsUpload", (req, res) => {
    res.render("EventsUpload")
})

app.get("/AdminAprroval", (req, res) => {
    res.render("AdminAprroval")
})
//send message
app.get("/SendMA", (req, res) => {
    res.render("SendMA")
})

app.get("/Feedback", (req, res) => {
    res.render("Feedback")
})
//latest Updates
app.get("/latestUpdate", (req, res) => {
    res.render("latestUpdate")
})

app.get("/postLatest", (req, res) => {
    res.render("postLatest")
})

// live location
app.get("/Location", (req, res) => {
    res.render("Location")
})
//share acheivements
app.get("/shareAcheivements", (req, res) => {
    res.render("shareAcheivements")
})
//display Acheivements
app.get("/displayAcheivements", (req, res) => {
    res.render("displayAcheivements")
})

//Mentor
app.get("/MentorR", (req, res) => {
    res.render("MentorR")
})
//Mentor
app.get("/MProfile", (req, res) => {
    res.render("MProfile")
})
//Mentor commitee
app.get("/mentorcommitee1", (req, res) => {
    res.render("mentorcommitee1")
})
//success
app.get("/Success", (req, res) => {
    res.render("Success")
})
//memborship
app.get("/benefits", (req, res) => {
    res.render("benefits")
})
app.get("/Membership", (req, res) => {
    res.render("Membership")
})


app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    // Retrieve the type from the session or request (ensure type is stored somewhere)
    const type = req.session.userType;
    const rollNo = req.session.UserRoll;


    // Check if email is already registered
    const existingEmail = await collect.findOne({ email });

    if (existingEmail) {
        return res.status(400).send('Email already registered.');
    }

    // Register the new user with the type
    const newRegistration = new collect({ email, password, type, rollNo });
    await newRegistration.save();

    return res.status(200).send('Registration successful.');
});


app.post('/check-details', async (req, res) => {
    const user = await collection.findOne({ rollNo: req.body.rollNO, FullName: req.body.fullName, DateOfBirth: req.body.dateOfBirth });
    console.log(user)
    req.session.userType = user.type;
    req.session.UserRoll = user.RollNo;

    if (user) {
        if (user.status) {
            return res.status(400).send('Already checked and registered.');
        } else {
            user.status = true;
            await user.save();

            console.log(req.session.userType)
            return res.status(200).send('Details are correct. You can now register.');
        }
    } else {
        return res.status(404).send('Details not found.');
    }
});
app.post("/Login", async (req, res) => {

    try {
        const check = await collect.findOne({ email: req.body.Email })
        console.log(check);


        if (check.password === req.body.password) {
            if (check.type === "Alumni") {
                const prof = await collection.findOne({ RollNo: check.rollNo })
                req.session.UserEmail = req.body.Email;
                req.session.Usertype = prof.type;
                req.session.Userbatch = prof.batch;
                req.session.userDepartment = prof.department;
                req.session.userName = prof.FullName;
                req.session.Roll_NO=prof.RollNo;

                res.render('AlumniHome', {
                    image: prof.img,
                    name: prof.FullName,
                    email: check.email,
                    batchYear: prof.batch,
                    department: prof.department

                })
            }
            else if (check.type === "staff") {
                const prof = await collection.findOne({ email: check.email })
                req.session.UserEmail = req.body.Email;
                req.session.Usertype = prof.type;
                req.session.Userbatch = prof.batch;
                req.session.userDepartment = prof.department;
                req.session.userName = prof.FullName;

                res.render('StaffHome', {
                    image: prof.img,
                    name: prof.FullName,
                    email: check.email,
                    batchYear: prof.batch,
                    department: prof.department,
                    staffName:prof.FullName

                })
            }
            else if (check.type === "current student") {
                const prof = await collection.findOne({ RollNo: check.rollNo })
                req.session.UserEmail = req.body.Email;
                req.session.Usertype = prof.type;
                req.session.Userbatch = prof.batch;
                req.session.userDepartment = prof.department;
                req.session.userName = prof.FullName;

                res.render('StudentHome', {
                    image: prof.img,
                    name: prof.FullName,
                    email: check.email,
                    batchYear: prof.batch,
                    department: prof.department,
                    studentName: prof.FullName

                })
            }
            else {
                const prof = await collection.findOne({ email: req.body.Email })
                AdminName = prof.FullName,
                res.render('AdministratorHome',{AdminName:AdminName})
            }

        }
        else {
            res.render('Login', { loginMsg: "wrong password" })
        }
    }
    catch {
        res.render('Login', { loginMsg: "wrong details" })
    }

})
app.get('/jobs', async (req, res) => {
    try {
        const jobs = await JobPost.find({});
        console.log(jobs);
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});

//edit profile

app.post('/profile/edit', async (req, res) => {
    try {
        const { name, email, batchYear, department } = req.body;
        const t = await collect.findOne({ email: email })
        updatedProfile = await collection.updateOne({ RollNo: t.rollNo }, { FullName: name, batch: batchYear, department: department });
        const prof = await collection.findOne({ RollNo: t.rollNo })
        console.log(prof)
        if (updatedProfile) {
            console.log(updatedProfile)
            res.json({ success: true, message: 'Profile updated successfully', profile: prof });
        } else {
            res.status(400).json({ success: false, message: 'Profile update failed' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating profile', error: error.message });
    }
});
//Alumni

app.post('/api/jobs', async (req, res) => {
    try {
        const { title, img, eligibility, package, jobType, lastDate, registrationLink, postedBy } = req.body;

        // Create a new job post
        const newJobPost = new JobPost({
            title,
            img,
            eligibility,
            package,
            jobType,
            lastDate,
            registrationLink,
            postedBy
        });

        // Save the job post to the database
        const savedJobPost = await newJobPost.save();

        // Respond with success
        res.json({ success: true, message: 'Job posted successfully', jobPost: savedJobPost });
    } catch (error) {
        console.error('Error posting job:', error);
        res.status(500).json({ success: false, message: 'Error posting job', error: error.message });
    }
});

//past Events
app.get('/events/past', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0]; // Current date in 'YYYY-MM-DD' format
        const pastEvents = await Events.find({ Date: { $lt: today } });

        res.render('pastEvents', { events: pastEvents });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving events', error });
    }
});

//upcoming
app.get('/events/upcome', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0]; // Current date in 'YYYY-MM-DD' format
        const pastEvents = await Events.find({ Date: { $gt: today } });

        res.render('pastEvents', { events: pastEvents });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving events', error });
    }
});

//Events Upload
app.post('/events/upload', async (req, res) => {
    try {
        const { title, img, venue, Date, time, Description, register } = req.body;

        // Create a new event document
        const newEvent = new Events({
            title,
            img,
            venue,
            Date,
            time,
            Description,
            register
        });

        // Save the event to the database
        await newEvent.save();

        // Send a success response
        res.json({ success: true, message: 'Event uploaded successfully!' });
    } catch (error) {
        console.error('Error uploading event:', error);
        res.status(500).json({ success: false, message: 'Error uploading event' });
    }
});
//send Message

app.post('/send-message', async (req, res) => {
    const { message, type, department, batch, recipientEmail,group } = req.body;
    const sender = req.session.UserEmail;
    console.log(group,sender);


    try {
        // If the type is 'all', send the message to both students and staff collections
        if (type === 'all') {
            const studentMessage = new Message({
                message,
                sender,
                type,
                department,
                batch,
                Groups:group,
                recipientEmail
            });

            const AlumniMessage = new MessageA({
                message,
                sender,
                type,
                department,
                batch,
                Groups:group,
                recipientEmail
            });

            const staffMessage = new MessageS({
                message,
                sender,
                type,
                department,
                Groups:group,
                recipientEmail
            });

            await studentMessage.save();  // Save to Student database
            await staffMessage.save();  // Save to Staff database
            await AlumniMessage.save();

            res.status(201).send({ success: true, message: 'Message sent to all!', });
        }


        // If the type is 'student', post the message to Student database only
        else if (type === 'current student') {
            const studentMessage = new Message({
                message,
                sender,
                type,
                department,
                batch,
                Groups:group,
                recipientEmail
            });

            await studentMessage.save();
            res.status(201).send({ success: true, message: 'Message sent to students!' });
        }
        // If the type is 'staff', post the message to Staff database only
        else if (type === 'staff') {
            const staffMessage = new MessageS({
                message,
                sender,
                type,
                department,
                Groups:group,
                recipientEmail
            });

            await staffMessage.save();
            res.status(201).send({ success: true, message: 'Message sent to staff!' });
        }

        else if (type === 'Alumni') {
            const staffMessage = new MessageA({
                message,
                sender,
                type,
                department,
                batch,
                Groups:group,
                recipientEmail
            });

            await staffMessage.save();
            res.status(201).send({ success: true, message: 'Message sent to staff!' });
        }
        // If the type is invalid
        else {
            res.status(400).send({ success: false, message: 'Invalid recipient type' });
        }

    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send({ success: false, message: 'Server error while sending message' });
    }
});

//notifications

app.get('/notifications', async (req, res) => {
    // Retrieve user info from the session or token
    const userEmail = req.session.UserEmail;  // Logged-in user's email
    const userType = req.session.Usertype;  // 'current student', 'staff', 'alumni'
    const userDepartment = req.session.userDepartment; // Department of logged-in user
    const userBatch = req.session.Userbatch; // Batch of logged-in user
    const c= await collection.findOne({email:userEmail})
    const userGroups = c.Groups;
    console.log(userGroups)

    try {
        let notifications = [];
        // Different queries based on user type
        if (userType === 'current student') {
            notifications = await Message.find({
                $or: [
                    { type: 'all'},
                    { type: 'student'},// For all users
                    {Groups: { $in: userGroups }},
                    { department: userDepartment },  // Match department
                    { batch: userBatch }  // Match batch
                ],
                sender: { $ne: userEmail }  // Exclude sender's own messages
            }).sort({ timestamp: -1 });
        } else if (userType === 'staff') {
            notifications = await MessageS.find({
                $or: [
                    { type: 'all' },
                    {Groups: { $in: userGroups }},
                    { type: 'staff'},
                    { department: userDepartment },
                    { batch: userBatch }
                ],
                sender: { $ne: userEmail }
            }).sort({ timestamp: -1 });
        } else if (userType === 'Alumni') {
            notifications = await MessageA.find({
                $or: [
                    { type: 'all'},
                    { type: 'Alumni'},
                    {Groups: { $in: userGroups }},
                    { department: userDepartment },
                    { batch: userBatch }
                ],
                sender: { $ne: userEmail }
            }).sort({ timestamp: -1 });
        }

        res.status(200).send({ success: true, notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).send({ success: false, message: 'Server error while fetching notifications' });
    }
});

//unread
app.post('/notifications/markAsRead', async (req, res) => {
    const userEmail = req.session.UserEmail;

    try {
        // Update all unread notifications for the current user
        await Message.updateMany(
            { recipientEmail: userEmail, read: false },
            { $set: { read: true } }
        );

        res.status(200).send({ success: true, message: 'Notifications marked as read' });
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        res.status(500).send({ success: false, message: 'Failed to mark notifications as read' });
    }
});

//Feedback
app.post('/submit-feedback', async (req, res) => {
    try {
        const feedback = new Feedback(req.body);
        await feedback.save();
        res.json({ success: true, message: 'Feedback submitted successfully' });
    } catch (error) {
        res.json({ success: false, message: 'Error submitting feedback', error });
        console.log(error)
    }
});

//latest Updates
app.get('/latest-updates', async (req, res) => {
    try {
        const updates = await Update.find().sort({ createdAt: -1 }); // Sorting by latest date
        res.status(200).send({ success: true, updates });
    } catch (error) {
        res.status(500).send({ success: false, message: 'Error fetching updates' });
    }
});

// post latest updates
app.post('/post-update', async (req, res) => {
    const { title, description, date } = req.body;

    try {
        // Save update to MongoDB
        const newUpdate = new Update({
            title,
            description,
            date
        });

        await newUpdate.save();

        res.status(200).json({ success: true, message: 'Update posted successfully!' });
    } catch (error) {
        console.error('Error posting update:', error);
        res.status(500).json({ success: false, message: 'Failed to post update.' });
    }
});

//Live Location
app.get('/api/alumni-locations', async (req, res) => {
    try {
        const locations = await AlumniLocation.find();
        res.json(locations);
    } catch (error) {
        res.status(500).send('Error fetching alumni locations');
    }
});

app.post('/api/add-alumni-location', async (req, res) => {
    const { name, location, latitude, longitude } = req.body;
    try {
        const newLocation = new AlumniLocation({ name, location, latitude, longitude });
        await newLocation.save();
        res.status(201).send('Location added successfully');
    } catch (error) {
        res.status(500).send('Error adding location');
    }
});

// display Acheivements
app.get('/achievements', async (req, res) => {
    const achievements = await Achievement.find();
    res.json(achievements);
});

// Post a new achievement (for adding data to the DB)
app.post('/achievements', async (req, res) => {
    const newAchievement = new Achievement(req.body);
    await newAchievement.save();
    res.status(201).json(newAchievement);
});
//likes
app.post('/achievements/:id/like', async (req, res) => {
    const achievement = await Achievement.findById(req.params.id);
    achievement.likes += 1;
    await achievement.save();
    res.status(200).json({ likes: achievement.likes });
});
//comments
app.post('/achievements/:id/comment', async (req, res) => {
    const achievement = await Achievement.findById(req.params.id);
    const newComment = {
        alumniName: req.session.userName,
        comment: req.body.comment,
    };
    achievement.comments.push(newComment);
    await achievement.save();
    res.status(201).json(achievement.comments);
});
//tags
app.post('/achievements/:id/tag', async (req, res) => {
    const achievement = await Achievement.findById(req.params.id);
    achievement.tags = [...new Set([...achievement.tags, ...req.body.tags])]; // Avoid duplicate tags
    await achievement.save();
    res.status(200).json(achievement.tags);
});
//Share Acheivements
app.post('/achievements', async (req, res) => {
    try {
        const achievement = new Achievement(req.body);
        await achievement.save();
        res.status(201).json(achievement);
    } catch (err) {
        res.status(500).json({ message: 'Error saving achievement' });
    }
});

//Gallery
app.get('/gallery', async (req, res) => {
    try {
        const images = await AlumniGallery.find({type:"gallery"});
        res.render('Gallery', { images:images });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

//profiles of success students
app.get('/Successprofile', async (req, res) => {
    try {
        const images = await AlumniGallery.find({type:"profiles"});
        res.render('SuccessProfile', { profiles:images });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

//success Interview
app.get('/SuccessInter', async (req, res) => {
    try {
        const images = await AlumniGallery.find({type:"interviews"});
        res.render('SuccessInter', { interviews:images });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

//Mentor
// Mentor Registration
app.post('/registered', async (req, res) => {
    console.log("yes")
    const { name, email, department, areasOfGuidance, profileImage } = req.body;
    const newMentor = new Mentor({ name, email, department, areasOfGuidance, profileImage });
    await newMentor.save();
    res.json({ success: true, message: 'Mentor registered successfully!' });
});
//Mentor profiles
app.get('/api/mentors', async (req, res) => {
    try {
        const mentors = await Mentor.find();
        res.json(mentors); // Send mentor profiles as JSON
    } catch (error) {
        console.error('Error fetching mentor profiles:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
//creategroup
// Create Group
app.post('/create-group', async (req, res) => {
    const { groupName, groupPurpose,targetAudience,groupImage,email } = req.body;
    const createdBy=req.session.userName

    const newGroup = new group({ groupName, groupPurpose,targetAudience,createdBy,groupImage,email });
    await newGroup.save();
    res.status(201).send('Group Created');

});

// Fetch all groups
app.get('/groups', async (req, res) => {
    try {
        const groups = await group.find({});
        res.json(groups);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

app.post('/join-group/:groupId', async (req, res) => {
    const userRollNo = req.session.Roll_NO;  // Assuming Roll_NO is stored in session after login
    const groupId = req.params.groupId;
    console.log(groupId)

    try {
        // Find the user by Roll_NO in collection1
        const user = await collection.findOne({ RollNo: userRollNo });
        console.log(user)

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
            console.log("Yes")
        }

        // Check if groupId is already in the user's groups array
        if (user.Groups.includes(groupId)) {
            console.log("yes1")
            return res.status(400).json({ msg: 'Already joined this group' });
        }

        // Add the groupId to the user's groups array
        console.log("Yes")
        user.Groups.push(groupId);
        console.log("Yes")
        await user.save();

        res.json({ msg: 'Group joined successfully', groupId });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

//post success
app.post('/admin/post-success-story', async (req, res) => {
    const { storyType, galleryTitle, galleryImage, profilePhoto,fullName, batch, achievement, description, location, contact, interviewTitle, interviewDate, interviewVideo, interviewSummary } = req.body;
    
    try {
        let storyData = { type: storyType };
        

        if (storyType === 'gallery') {
            storyData = {
                ...storyData,
                title: galleryTitle,
                imageUrl: galleryImage
            };
            console.log(storyData)

            
        } else if (storyType === 'profiles') {
            storyData = {
                ...storyData,
                title: fullName,
                fullName,
                batch,
                achievement,
                description,
                location,
                contact,
                profilePhoto
            };
        } else if (storyType === 'interviews') {
            storyData = {
                ...storyData,
                title: interviewTitle,
                interviewDate,
                videoUrl: interviewVideo,
                summary: interviewSummary
            };
        }
        

        const newStory = new AlumniGallery(storyData);
        await newStory.save();
        
        res.status(201).json({ msg: 'Success story posted successfully', data: newStory });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

//Groups
// Fetch groups from the database
app.get('/admin/groups', async (req, res) => {
    try {
        const groups = await group.find();  // Assuming 'Group' is the Mongoose model
        
        res.json(groups);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});


//mentor
router.get('/mentors', async (req, res) => {
    try {
        const mentors = await Mentor.find();
        res.json(mentors);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching mentors' });
    }
});

//check details
const Validate_Details=require("./checkDetails")
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public')); // For serving static files like images
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
    }
});
const upload = multer({ storage });
app.post('/submit', upload.fields([{ name: 'image' }, { name: 'document' }]), async (req, res) => {
    const { fullName, email, rollNumber, batchYear, department, dob, phoneNumber} = req.body;

    const newUser = new Validate_Details({
        fullName,
        email,
        rollNumber,
        batchYear,
        department,
        dob,
        phoneNumber,
        image: req.files['image'][0].filename, // Store image file path
        document: req.files['document'][0].filename ,// Store document file path
        type:req.body.category
    });

    await newUser.save();
    res.json({ message: 'Details submitted successfully' });
});

//Admin Approval Page
app.get('/pending', async (req, res) => {
    const pendingRequests = await Validate_Details.find({ approved: false });
    res.json(pendingRequests);
});
function generateApprovalKey() {
    return crypto.randomBytes(8).toString('hex');
}

app.post('/approve', async (req, res) => {
    const { userId, email } = req.body;

    try {
        const user = await Validate_Details.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate and assign an approval key
        const approvalKey = generateApprovalKey();
        user.approved = true;
        user.approvalKey = approvalKey;
        await user.save();

        // Save approved user to collection1
        const newUser = new collection({
            RollNo: user.rollNumber,
            FullName: user.fullName,
            DateOfBirth: user.dob,
            status: true,
            type: user.type,
            img: user.image,
            batch: user.batchYear,
            department: user.department,
            email: user.email,
            Phno: user.phoneNumber,
        });
        await newUser.save();

        // Save new user credentials in collect
        const newOne = new collect({
            email: user.email,
            password: approvalKey,
            type: user.type,
            rollNo: user.rollNumber
        });
        await newOne.save();

        // Set up nodemailer to send approval email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'bharathnani867@gmail.com',
                pass: 'vnct cifm dlho hbmg'
            }
        });

        // Email content
        const mailOptions = {
            from: 'bharathnani867@gmail.com',
            to: email,
            subject: 'Alumni Registration Approved',
            html: `
                <p>Dear ${user.fullName},</p>
                <p>Your alumni registration has been approved. You can now use the following key to complete your registration:</p>
                <p><strong>Key: ${approvalKey}</strong></p>
                <p>Best regards,<br>Alumni Association</p>
            `
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ error: 'Error sending email' });
            }
            console.log('Email sent:', info.response);
            res.status(200).json({ message: 'User approved and email sent.' });
        });
    } catch (error) {
        console.error('Error in approval process:', error);
        res.status(500).json({ error: 'An error occurred during approval.' });
    }
});
//payment
const Payment = require('./Donate');
app.get("/AdminDonate", (req, res) => {
    res.render("AdminDonate")
})
app.post('/api/payments', upload.single('screenshot'), async (req, res) => {
    try {
        const { name, email, phone, amount } = req.body;
        const payment = new Payment({
            name,
            email,
            phone,
            amount,
            screenshot: req.file.filename // Store the filename
        });
        await payment.save();
        res.status(201).json({ message: 'Payment details stored successfully!' });
    } catch (error) {
        console.error('Error storing payment details:', error);
        res.status(500).json({ message: 'Failed to store payment details.' });
    }
});
//retrieving the donations
app.get('/api/donations', async (req, res) => {
    try {
        const donations = await Payment.find({});
        res.status(200).json({ donations });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching donations' });
    }
});

// Delete donation
app.delete('/api/donations/:id', async (req, res) => {
    try {
        await Payment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Donation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting donation' });
    }
});

//search functionality
app.get('/api/searchStudents', async (req, res) => {
    const { query } = req.query; // Expecting query parameters: name, year, department, type
    const searchCriteria = {
        $or: [
            { FullName: { $regex: query, $options: 'i' } },
            { batch: { $regex: query, $options: 'i' } },
            { department: { $regex: query, $options: 'i' } },
            { type: { $regex: query, $options: 'i' } }
        ]
    };

    try {
        const results = await collection.find(searchCriteria);
        console.log(results);
        res.status(200).json({ members: results });
    } catch (error) {
        res.status(500).json({ message: 'Error searching members', error });
    }
});


app.listen(3000, () => {
    console.log("port now connected");
})