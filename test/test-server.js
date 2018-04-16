const {app, runServer, closeServer} = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

describe('blog', function() {
	before(function() {
		return runServer();
	});

	after(function() {
		return closeServer();
	});

	it('should list all posts on GET', function() {
		return chai.request(app)
		.get('/blog-posts')
		.then(function(res) {
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body).to.be.a('array');
			expect(res.body.length).to.be.at.least(1);
			const expectKeys = ['title','content','author','id'];
			res.body.forEach(function(item) {
				expect(item).to.be.a('object');
				expect(item).to.include.keys(expectKeys);
			});
		});
	});

	it('should add a new post on POST', function() {
		const newPost = {title: 'My new cat', content: 'i like cats and i like dogs', author: 'cat lady'};
		return chai.request(app)
			.post('/blog-posts')
			.send(newPost)
			.then(function(res) {
				expect(res).to.have.status(201);
				expect(res).to.be.json;
				expect(res.body).to.be.a('object');
				// publish date is optional
				expect(res.body).to.include.keys('id','title','author','content');
				expect(res.body.id).to.not.equal(null);
			});
	});

	it('should update items on PUT', function() {
		const updatePost = {
			title:'look a new title', 
			content:'look new content', 
			author:'look new author'
		};

		return chai.request(app)
			.get('/blog-posts')
			.then(function(res) {
				updatePost.id = res.body[0].id;
				return chai.request(app)
					.put(`/blog-posts/${updatePost.id}`)
					.send(updatePost);
			})
			.then(function(res) {
				expect(res).to.have.status(204);
			});
	});

	it('should delete items on DELETE', function() {
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res) {
				return chai.request(app)
					.delete(`/blog-posts/${res.body.id}`);
			})
			.then(function(res) {
				expect(res).to.have.status(204);
			});
	});

});