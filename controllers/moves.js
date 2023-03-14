const express = require('express')
const Moves = require('../models/moves.js')
const router = express.Router()


// custom middleware to require authentication of routes
const authRequired = (req, res, next) => {
	// console.log(req.session.currentUser)
	if (req.session.currentUser) {
		// a user is signed in
		next()
		// next is part of express
		// iot does what it says
		// i.e., go on to the next thing
	} else {
		// if there is no user
		res.send('You must be loggin in to do that!')
		// res.redirect('/users/signin')
	}
}

// ROUTES 
// About
router.get('/about', (req, res) => {
 	res.render('about.ejs')
})

// INDEX ROUTE
// we do not have to type /moves anymore express handles this for us in router
router.get('/', (req, res) => {
	Moves.find({}, (err, foundMoves) => {
		if(err){console.log(err.message)}
		// console.log(foundMoves[0])
		res.render('index.ejs', {
			moves: foundMoves
		})
	})
})



// POST MOVES DATA TO DB
router.post('/', (req, res) => {
	if (req.body.thumbsUp === 'on') {
		//if checked, req.body.thumbsUp is set to 'on'
		req.body.thumbsUp = true;
	} else {
		//if not checked, req.body.thumbsUp is undefined
		req.body.thumbsUp = false;
	}
    // console.log(req.body, 'THIS IS THE MOVE')
	Moves.create(req.body, (error, createdMoves) => {
        // console.log(error, "THIS IS THE ERROR")
        console.log(createdMoves, 'CREATED MOVES')
		res.redirect('/moves') //<--- redirect to index.ejs
		// res.redirect('/moves/' + createdMoves.id); <-- redirect to a single show page
	});
});

// RENDER NEW MOVE PAGE
router.get('/new', (req,res) => {
    res.render('new.ejs')
})

router.get('/seed', (req, res) =>{
	Moves.create([
		{
            name:'Wheelchair Defense',
            description:'sick',
            comments:'bad ass',
			thumbsUp: true,
			link:'https://www.youtube.com/embed/WDb8ute4lQs',
			
        },
        {
            name:'Israeli Krav Maga',
            description:'sicker',
            comments: 'badder ass',
			thumbsUp: true,
			link:'https://www.youtube.com/embed/2dCdfcraDB0',
        },
        {
            name:'Slapfight Defense',
            description:'sickest',
            comments:'baddest ass',
			thumbsUp: true,
			link:'https://www.youtube.com/embed/JYKzzAzgg_w',
        },
		{
			name:'Environmental Self Defense Demo',
			description: 'How to make the best use of environment to defend yourself',
			comments:'I love how although they absolutely hate each other, in the sewers they both help together to beat the crocodile and then return to their normal fight, and even take breaks and have conversations and visit each other, so basically they are frenemies.',
			thumbsUp: true,
			link:'https://www.youtube.com/embed/AiyJI5Kmcro',
		},
		{
			name:'Deadliest Self Defense Move',
			description:'',
			comments:'',
			thumbsUp: false,
			link:'https://www.youtube.com/embed/4NnTxxewYD8',
		},
		{
			name:'Gun Disarm',
			description: 'Delta Force, LT. General (Ret.) Jerry Boykin says,- "Victor Marx is one of the top martial artists in the country. I have never seen anybody with faster hands"  Follow victor on FB @ "https://www.facebook.com/victormarx"',
			comments: '',
			thumbsUp: true,
			link:'https://www.youtube.com/embed/RK90rpSVRtQ',
		},

	], (err, data) => {
		if(err) {
			console.log(err.message)
		}
		res.send(req.body)
	})
})

router.get('/:id', (req, res) => {
	Moves.findById(req.params.id, (err, foundMoves) => {
		if(err){console.log(err.message)}
		res.render('show.ejs', {
			moves: foundMoves
		})
	})
})

// setup our DELETE route 
router.delete('/:id', (req, res) => {
	Moves.findByIdAndDelete(req.params.id, (err, deletedMoves) => {
		// findByIdAndDelete will delete a document with a given id 
		if(err) {
			console.log(err)
			res.send(err)
		} else {
			// redirect to the index page if the delete is successful 
			console.log(deletedMoves)
			res.redirect('/moves')
		}
	})
})

// make an edit page and a route to it 
// create an edit.ejs view 
// link to the edit page from each of the fruits 
router.get('/:id/edit', authRequired, (req, res) => {
	Moves.findById(req.params.id, (err, foundMoves) => {
		if(err) {
			console.log(err)
			res.send(err)
		} else {
			// make the edit form show the existing data 
			res.render('edit.ejs', {
				moves: foundMoves
			})
		}
	})
})

router.put('/:id', (req, res) => {
	// let's make our route actually update the model 
	// console.log(req.body)
	if (req.body.thumbsUp === "on") {
		req.body.thumbsUp = true
	} else {
		req.body.thumbsUp = false
	}

	Moves.findByIdAndUpdate(req.params.id, req.body, { new: true,}, 
	(err, updatedMoves) => {
		// findByIdAndUpdate updates a move with a given id
		// the new option means we wait get the updated move returned 
		// without this flag, we will get the move before it was modified

		if(err) {
			console.log(err)
			res.send(err)
		} else {
			console.log(updatedMoves)
			// redirect to the index route 
			res.redirect('/moves')
		}

	})
})

module.exports = router