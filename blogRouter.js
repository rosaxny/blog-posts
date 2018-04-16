const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create('Post 1', `sentence 1`, 'author');
BlogPosts.create('Post 2', `*****************************`, 'author');
BlogPosts.create('Post 3', `kitty`, 'author');


router.get('/', (req, res) => {
	res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for(let i = 0; i<requiredFields.length; i++) {
		if(!(requiredFields[i] in req.body)) {
			const message = `Missing \`${requiredFields[i]}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	const newItem = BlogPosts.create(req.body.title, req.body.content, req.body.author);
	res.status(201).json(newItem);
});

router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	res.status(204).end();
});

router.put('/:id', jsonParser, (req, res) => {
	const requiredFields = ['id', 'title', 'content', 'author'];
	for(let i = 0; i<requiredFields.length; i++) {
		if(!(requiredFields[i] in req.body)) {
			const message = `Missing \`${requiredFields[i]}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	if(req.params.id !== req.body.id) {
		const message = (`Request path id (${req.params.id}) and request body id (${req.body.id}) must match`);
		console.error(message);
		return res.status(400).send(message);
	}
	const updateItem = BlogPosts.update({
		id: req.params.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author
	});
	res.status(204).end();
});

module.exports = router;
