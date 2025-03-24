const express = require("express")
const multer = require('multer')
const mongoose = require('mongoose')
const { MongoClient, ObjectID } = require('mongodb');
const app = express()
const session = require('express-session')
const path = require("path")
const hbs = require("hbs")
const collection = require("./mongodb")
const RequestNew = require("./requestForNew")
const collect = require("./mongodb1")
const books = require("./mongodb2")
const StdData = require("./StudentData")
const SubmitData = require("./Submit")
const BookFines = require("./Fines")
const publicpath = path.join(__dirname, '../public')
const templatepath = path.join(__dirname, '../templates')
const keypath = path.join(__dirname, '../keys')
const upload = multer({ dest: 'uploads/' })
const bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));
console.log(templatepath)
console.log(keypath)
app.use(express.json())
app.set("view engine", "hbs")
app.set("views", publicpath)

app.use(express.urlencoded({ extended: false }))
app.use(express.static(templatepath))
app.use(express.static(keypath))
app.get("/start", (req, res) => {
    res.render("start")
})
app.get("/", (req, res) => {
    res.render("start")
})
app.get("/signup", (req, res) => {
    res.render("signup")
})
app.get("/adminstd", (req, res) => {
    res.render("adminstd")
})
app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password
    }
    await collection.insertMany([data])
    res.render('signup')


})
app.post("/login", async (req, res) => {

    try {
        const check = await collection.findOne({ name: req.body.name })

        if (check.password === req.body.password) {
            req.session.loginName = req.body.name;
            res.render('homestd', { displayName: check.name })
        }
        else {
            res.render('signup', { loginMsg: "wrong password" })
        }
    }
    catch {
        res.render('signup', { loginMsg: "wrong details" })
    }

})


app.post("/adminstd", async (req, res) => {
    try {
        const c = await collect.findOne({ name: req.body.name })

        if (c.password === req.body.password) {
            res.render('homeadm', { displayName1: c.name })
        }
        else {
            res.render('adminstd', { admMsg: "password is not valid" })
        }
    }
    catch {
        res.render('adminstd', { admMsg: "details are not registered" })
    }

})
app.get("/Add-Books", (req, res) => {
    res.render("Add-Books")
})
app.post('/Add-Books', async (req, res) => {
    const d = {
        image: req.body.image,
        Title: req.body.Title,
        Author: req.body.Author,
        Genre: req.body.Genre,
        Available: req.body.Available,
        location: req.body.location
    }
    await books.insertMany([d])
    res.status(200).json({ success: true,message:"Book Added Successfully"});
});

app.get("/RequestForNew", (req, res) => {
    res.render("RequestForNew")
})
app.post('/Requested-Book', async (req, res) => {
    const d = {
        image: req.body.image,
        Title: req.body.Title,
        Author: req.body.Author,
        Genre: req.body.Genre
    }
    await RequestNew.insertMany([d])
    res.status(200).json({ success: true,message:"Request Sent Successfully"});
});


app.get('/modify-books', (req, res) => {
    res.render('modify-books')
});

app.post('/modify-books', async (req, res) => {
    try {

        const userId = req.body.Title;
        

        const update = {
            image: req.body.image,
            Title: req.body.Title,
            Author: req.body.Author,
            Genre: req.body.Genre,
            Available: req.body.Available,
            location: req.body.location
        };

        const updatedBook = await books.updateMany({ Title: userId }, update, { new: true });


        if (!updatedBook) {
            res.status(404).json({ success: false,message:"Book not found"});
        } else {
            res.status(200).json({ success: true,message:"Book Modified Successfully"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        const regex = new RegExp(query, 'i');

        const book = await books.find({
            $or: [
                { Title: { $regex: regex } },
                { Author: { $regex: regex } }
            ]
        }).exec();

        res.json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
app.get('/suggestions', async (req, res) => {
    try {
        const suggestions = await books.find({ Available: { $gt: 0 },Genre:'Text Book' }).limit(8).exec();

        res.json(suggestions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/suggestions1', async (req, res) => {
    try {
        const suggestions1 = await books.find({ Available: { $gt: 0 },Genre:'Text Book' }).limit(8).exec();

        res.json(suggestions1);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.get('/newbook1', async (req, res) => {
    try {
        const newbook1 = await books.find({ Available: { $gt: 0 },Genre:'New Book' }).limit(8).exec();

        res.json(newbook1);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.get('/magzine', async (req, res) => {
    try {
        const magzine = await books.find({ Available: { $gt: 0 },Genre:'Magzine' }).limit(8).exec();

        res.json(magzine);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.get('/journal1', async (req, res) => {
    try {
        const journal1 = await books.find({ Available: { $gt: 0 },Genre:'Journal' }).limit(8).exec();

        res.json(journal1);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.get('/project1', async (req, res) => {
    try {
        const project1 = await books.find({ Available: { $gt: 0 }, $or: [
            { Genre: 'Projects' },
            { Genere: 'Research' }
        ] }).limit(8).exec();

        res.json(project1);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).json({ message: 'An error occurred while logging out' });
        } else {
            res.redirect('/start'); // Redirect to login page after logout
        }
    });
});
// Book lending route
app.post('/books/:id/lend', async (req, res) => {
    const bookId = req.params.id;

    // Fetch book details from the database
    const book = await books.findOne({ Title: bookId });
    if (!book) {
        return res.status(404).send('<h1>Book not found</h1>');
    }

    const studentName = req.body.studentName; // Get student name from request body
    const typeOfAdd = book.Available === 0 ? 'Request' : 'BookLended';
    const dateBorrowed = new Date();
    const stdData = {
        image: book.image,
        Title: book.Title,
        Author: book.Author,
        Genre: book.Genre,
        Available: book.Available,
        location:book.location,
        StudentName: studentName,
        TypeOfAdd: typeOfAdd,
        DateBarrowed: dateBorrowed
    };
    const r = book.Available - 1;
    const stdData1 = {
        image: book.image,
        Title: book.Title,
        Author: book.Author,
        Genre: book.Genre,
        Available: r,
        location:book.location,
        StudentName: studentName,
        TypeOfAdd: typeOfAdd
    };

    try {
        if (book.Available === 0) {
            await StdData.insertMany(stdData);
            res.status(200).send('Successfully added book');
        } else if (book.Available > 0) {
            const r = books.Available;
            const update = await books.updateMany({ Title: bookId }, stdData1, { new: true });
            await StdData.insertMany(stdData);
            res.status(200).send('Successfully lended book');;
        }
    } catch (err) {
        console.error('Error adding book to StdData collection:', err);
        return res.status(500).send('<h1>Internal Server Error</h1>');
    }
});


app.get('/Book-Lended', (req, res) => {
    res.render('Book-Lended')
});

app.get('/AddLendedBooks', async (req, res) => {
    try {
        const loginName = req.session.loginName;
        const AddLendedBooks = await StdData.find({ StudentName: loginName, TypeOfAdd: "BookLended" });
        res.json(AddLendedBooks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.get('/NewBookRequests', (req, res) => {
    res.render('NewBookRequests')
});

app.get('/NewRequests', async (req, res) => {
    try {
        const RequestNew1 = await RequestNew.find();
        res.json(RequestNew1);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/Newbook/:title/lend', async (req, res) => {
    const bookTitle1 = req.params.title;

    try {
        await RequestNew.deleteMany({Title: bookTitle1});
        return res.send("waiting for confirmation");
    } catch (err) {
        console.error('Error adding book to StdData collection:', err);
        return res.status(500).send('<h1>Internal Server Error</h1>');
    }
});




app.get('/StdFines', (req, res) => {
    res.render('StdFines')
});

app.get('/Finesbody', async (req, res) => {
    try {
        const loginName = req.session.loginName;
        const Finesbody = await BookFines.find({ StudentName: loginName });
        res.json(Finesbody);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/AdmFines', (req, res) => {
    res.render('AdmFines')
});

app.get('/AdmFinesbody', async (req, res) => {
    try {
        const AdmFinesbody = await BookFines.find({ Fines1: { $gt: 0 } });
        res.json(AdmFinesbody);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/Book-requests', (req, res) => {
    res.render('Book-requests')
});

app.get('/AddRequestedBooks', async (req, res) => {
    try {
        const loginName = req.session.loginName;
        const AddRequestedBooks = await StdData.find({ StudentName: loginName, TypeOfAdd: "Request" });
        res.json(AddRequestedBooks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/Requests', (req, res) => {
    res.render('Requests')
});

app.get('/ALLRequestedBooks', async (req, res) => {
    try {
        const loginName = req.session.loginName;
        const ALLRequestedBooks = await StdData.find({ TypeOfAdd: "Request" });
        res.json(ALLRequestedBooks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.post('/submited/:title/lend', async (req, res) => {
    const bookTitle = req.params.title;
    const loginName = req.session.loginName;

    // Fetch book details from the database
    const book1 = await StdData.findOne({ StudentName: loginName, Title: bookTitle });
    const l1=await books.findOne({Title:bookTitle})
    if (!book1) {
        return res.status(404).send('<h1>Book not found</h1>');
    }

    const typeOfAdd1 = "confirmation";

    const stdData2 = {
        image: book1.image,
        Title: book1.Title,
        Author: book1.Author,
        Genre: book1.Genre,
        Available: l1.Available,
        StudentName: loginName,
        TypeOfAdd: typeOfAdd1
    };
    try {
        const c = await SubmitData.insertMany(stdData2);
        return res.send("waiting for confirmation");
    } catch (err) {
        console.error('Error adding book to StdData collection:', err);
        return res.status(500).send('<h1>Internal Server Error</h1>');
    }
});

app.get('/Submissions', (req, res) => {
    res.render('Submissions')
});

app.get('/SubmissionPending', async (req, res) => {
    try {
        const SubmittedBooks = await SubmitData.find({ TypeOfAdd: "confirmation" });
        res.json(SubmittedBooks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.post('/sub/:Name/:title/lend', async (req, res) => {
    const bookName1 = req.params.Name;
    const bookTitle1 = req.params.title;


    const book2 = await StdData.findOne({ StudentName: bookName1, Title: bookTitle1 });
    const b_c = await books.findOne({ Title: bookTitle1 });

    if (!book2) {
        return res.status(404).send('<h1>Book not found</h1>');
    }

    const typeOfAdd1 = "Submit";
    const incm = b_c.Available + 1;
    const dateReturned = new Date();


    const daysOverdue = Math.ceil((dateReturned - new Date(book2.DateBarrowed)) / (1000 * 60 * 60));
    const fine = daysOverdue * 5;
    const fineData = {
        StudentName: book2.StudentName,
        Book: book2.Title,
        DateBorrowed: book2.DateBarrowed,
        DateRetured: dateReturned,
        Fines1: fine,
    }
    const stdData3 = {
        image: book2.image,
        Title: book2.Title,
        Author: book2.Author,
        Genre: book2.Genre,
        Available: incm,
        StudentName: bookName1,
        TypeOfAdd: typeOfAdd1,

    };

    try {
        await BookFines.insertMany(fineData);
        const m = await books.updateMany({ Title: book2.Title }, stdData3);
        const c = await SubmitData.updateMany({ StudentName: bookName1, Title: book2.Title, TypeOfAdd: "confirmation" }, stdData3);
        const d = await StdData.deleteMany({ Title: book2.Title, StudentName: bookName1, TypeOfAdd: "BookLended" });
        const d1 = await StdData.updateMany({ Title: book2.Title, TypeOfAdd: "Request" }, { Available: incm });
        return res.send("waiting for confirmation");
    } catch (err) {
        console.error('Error adding book to StdData collection:', err);
        return res.status(500).send('<h1>Internal Server Error</h1>');
    }
});

app.get('/Submissions', (req, res) => {
    res.render('Submissions')
});

app.get('/SubmitBooks', (req, res) => {
    res.render('SubmitBooks')
});

app.get('/SubmittedBooks', async (req, res) => {
    try {
        const loginName = req.session.loginName;
        const SubmittedBooks1 = await SubmitData.find({ StudentName: loginName, TypeOfAdd: "Submit" });
        res.json(SubmittedBooks1);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/subBook/:Name/:title/lend', async (req, res) => {
    const SName = req.params.Name;
    const BTitle = req.params.title;


    // Fetch book details from the database
    const book3 = await StdData.findOne({ StudentName: SName, Title: BTitle, TypeOfAdd: 'Request' });

    if (!book3) {
        return res.status(404).send('<h1>Book not found</h1>');
    }

    const dateBorrowed = new Date();
    const typeOfAdd1 = "BookLended";
    const incm = book3.Available - 1;
    const stdData4 = {
        image: book3.image,
        Title: book3.Title,
        Author: book3.Author,
        Genre: book3.Genre,
        Available: incm,
        StudentName: SName,
        location:book3.location,
        TypeOfAdd: typeOfAdd1,
        DateBarrowed: dateBorrowed
    };
    try {
        const m = await books.updateMany({ Title: BTitle }, stdData4);
        const d = await StdData.updateMany({ Title: book3.Title, StudentName: SName, TypeOfAdd: "Request" }, stdData4);
        return res.send("Book issued");
    } catch (err) {
        console.error('Error adding book to StdData collection:', err);
        return res.status(500).send('<h1>Internal Server Error</h1>');
    }
});




app.listen(3000, () => {
    console.log("port connect");
})