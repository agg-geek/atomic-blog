import { createContext, useContext, useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';

function createRandomPost() {
	return {
		title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
		body: faker.hacker.phrase(),
	};
}

// PostContext is now a Component
// PostContext because this will provide values related to the blog's Post
const PostContext = createContext();

function App() {
	const [posts, setPosts] = useState(() =>
		Array.from({ length: 30 }, () => createRandomPost())
	);
	const [searchQuery, setSearchQuery] = useState('');
	const [isFakeDark, setIsFakeDark] = useState(false);

	const searchedPosts =
		searchQuery.length > 0
			? posts.filter(post =>
					`${post.title} ${post.body}`
						.toLowerCase()
						.includes(searchQuery.toLowerCase())
			  )
			: posts;

	function handleAddPost(post) {
		setPosts(posts => [post, ...posts]);
	}

	function handleClearPosts() {
		setPosts([]);
	}

	useEffect(
		function () {
			document.documentElement.classList.toggle('fake-dark-mode');
		},
		[isFakeDark]
	);

	return (
		// Notice the component tree after creating the Provider
		<PostContext.Provider
			value={{
				posts: searchedPosts,
				onAddPost: handleAddPost,
				onClearPosts: handleClearPosts,
				// we also provide the Query context to PostContext
				// though we should've created a QueryContext for it
				searchQuery,
				setSearchQuery,
			}}
		>
			<section>
				<button
					onClick={() => setIsFakeDark(isFakeDark => !isFakeDark)}
					className="btn-fake-dark-mode"
				>
					{isFakeDark ? '☀️' : '🌙'}
				</button>

				<Header />
				<Main posts={searchedPosts} onAddPost={handleAddPost} />
				<Archive onAddPost={handleAddPost} />
				<Footer />
			</section>
		</PostContext.Provider>
	);
}

function Header() {
	const { onClearPosts } = useContext(PostContext.Consumer);

	return (
		<header>
			<h1>
				<span>⚛️</span>The Atomic Blog
			</h1>
			<div>
				<Results />
				<SearchPosts />
				<button onClick={onClearPosts}>Clear posts</button>
			</div>
		</header>
	);
}

function SearchPosts() {
	const { searchQuery, setSearchQuery } = useContext(PostContext.Consumer);

	return (
		<input
			value={searchQuery}
			onChange={e => setSearchQuery(e.target.value)}
			placeholder="Search posts..."
		/>
	);
}

function Results() {
	const { posts } = useContext(PostContext.Consumer);
	return <p>🚀 {posts.length} atomic posts found</p>;
}

function Main({ posts, onAddPost }) {
	return (
		<main>
			<FormAddPost onAddPost={onAddPost} />
			<Posts posts={posts} />
		</main>
	);
}

function Posts({ posts }) {
	return (
		<section>
			<List posts={posts} />
		</section>
	);
}

function FormAddPost({ onAddPost }) {
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');

	const handleSubmit = function (e) {
		e.preventDefault();
		if (!body || !title) return;
		onAddPost({ title, body });
		setTitle('');
		setBody('');
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				value={title}
				onChange={e => setTitle(e.target.value)}
				placeholder="Post title"
			/>
			<textarea
				value={body}
				onChange={e => setBody(e.target.value)}
				placeholder="Post body"
			/>
			<button>Add post</button>
		</form>
	);
}

function List({ posts }) {
	return (
		<ul>
			{posts.map((post, i) => (
				<li key={i}>
					<h3>{post.title}</h3>
					<p>{post.body}</p>
				</li>
			))}
		</ul>
	);
}

function Archive({ onAddPost }) {
	const [posts] = useState(() =>
		Array.from({ length: 10000 }, () => createRandomPost())
	);

	const [showArchive, setShowArchive] = useState(false);

	return (
		<aside>
			<h2>Post archive</h2>
			<button onClick={() => setShowArchive(s => !s)}>
				{showArchive ? 'Hide archive posts' : 'Show archive posts'}
			</button>

			{showArchive && (
				<ul>
					{posts.map((post, i) => (
						<li key={i}>
							<p>
								<strong>{post.title}:</strong> {post.body}
							</p>
							<button onClick={() => onAddPost(post)}>
								Add as new post
							</button>
						</li>
					))}
				</ul>
			)}
		</aside>
	);
}

function Footer() {
	return <footer>&copy; by The Atomic Blog ✌️</footer>;
}

export default App;
