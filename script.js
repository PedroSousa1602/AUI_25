class Post {
    id;
    pubDate;
    title;
    body;
    attachments;

    constructor(id, title, body, attachments) {
        this.id = id;
        this.pubDate = new Date();
        this.title = title;
        this.body = body;
        this.attachments = attachments;
    }

    toString() {
        return `Post ID: ${this.id}\n
            Title: ${this.title}\n
            Body: ${this.body}\n
            ${this.attachments ? `Attachments: ${this.attachments}\n` : ''}\n
            Published on: ${this.pubDate}`;
    }
}

class PostService {
    posts = JSON.parse(localStorage.getItem("posts-list")) || [];

    isPostDtoValid(postDto) {
        if (!(postDto.title && postDto.body)) {
            console.log("Post's title and body cannot be empty.");
        }
        else if (!postDto.title) {
            console.log("Post title cannot be empty.");
        }
        else if (!postDto.body) {
            console.log("Post body cannot be empty.");
        }
        return (postDto.title && postDto.body);
    };

    createPost(postDto) {
        if (this.isPostDtoValid(postDto)) {
            this.posts.length === 0 ? postDto.id = 1 : postDto.id = this.posts.at(-1).id + 1;
            const newPost = new Post(postDto.id, postDto.title, postDto.body, postDto.attachments);
            this.posts.push(newPost);
            localStorage.setItem("posts-list", JSON.stringify(this.posts));
            console.log("Post created successfully.\n", newPost);
        }
    }

    deletePost(post) {
        this.posts = this.posts.filter(p => p.id !== post.id);
        localStorage.setItem("posts-list", JSON.stringify(this.posts));
        console.log("Post deleted successfully.\n");
    }
}

const postService = new PostService();

//! test code

// change variable to false to disable test data
const TESTING = false;
// mock data
const addTestPosts = () => {
    const p1 = {
        title: "First Post",
        body: "First post content.",
        attachments: null
    };

    const p2 = {
        title: "Second Post",
        body: "Second post content.",
        attachments: null
    };

    const p3 = {
        title: "Third Post",
        body: "Third post content.",
        attachments: null
    };

    postService.createPost(p1);
    postService.createPost(p2);
    postService.createPost(p3);
}

if (TESTING && postService.posts.length === 0) {
    addTestPosts();
}

//! end test code

const showNoPostsBox = () => {
    let noPostsDiv = document.getElementById("no-posts");
    noPostsDiv.setAttribute("class", "no-posts");
    const iconDiv = document.createElement("div");
    iconDiv.setAttribute("class", "np-icon");
    noPostsDiv.appendChild(iconDiv);
    const noPublicationsMsg = document.createElement("p");
    noPublicationsMsg.textContent = "Ainda não há publicações.";
    noPostsDiv.appendChild(noPublicationsMsg);
};

const renderPost = (post) => {
    const postListDiv = document.getElementById("posts-list");

    let postDiv = document.createElement("div");
    postDiv.setAttribute("class", "post");
    postListDiv.appendChild(postDiv);

    const postHeaderDiv = document.createElement("div");
    postHeaderDiv.setAttribute("class", "post-header");
    postDiv.appendChild(postHeaderDiv);

    // post header - title
    const title = document.createElement("h1");
    title.textContent = post.title;

    // post header - actions
    const postActionsDiv = document.createElement("div");
    postActionsDiv.setAttribute("class", "post-actions");

    const editBtn = document.createElement("button");
    editBtn.setAttribute("class", "edit-btn");
    editBtn.onclick = () => alert("Edit post feature coming soon!");

    const deleteBtn = document.createElement("button");
    deleteBtn.setAttribute("class", "delete-btn");
    deleteBtn.onclick = () => {
        if (confirm("Tem certeza que deseja deletar esta publicação?")) {
            postService.deletePost(post);
            window.location.reload();
        }
    }

    postActionsDiv.append(editBtn, deleteBtn);
    postHeaderDiv.append(title, postActionsDiv);

    // post's image (if any)
    //todo: feature to upload attachments not implemented yet
    if (post.attachments) {
        const imgBoxDiv = document.createElement("div");
        imgBoxDiv.setAttribute("class", "img-box");
        postDiv.appendChild(imgBoxDiv);
    }

    // post content
    const contentDiv = document.createElement("div");
    contentDiv.setAttribute("class", "conteudo");
    const contentParagraph = document.createElement("p");
    contentDiv.appendChild(contentParagraph);
    contentParagraph.textContent = post.body;
    postDiv.appendChild(contentDiv);
};

(() => document.addEventListener("DOMContentLoaded", () => {
    if (postService.posts.length === 0) {
        showNoPostsBox();
    } else {
        for (let post of postService.posts) {
            renderPost(post);
        }
    }
}))();

const showModal = () => {
    const modal = document.getElementById("modal");
    modal.classList.add("show-modal");
}

const closeModal = () => {
    const modal = document.getElementById("modal");
    modal.classList.remove("show-modal");
}

window.addEventListener("click", e => (e.target === modal ? modal.classList.remove("show-modal") : false));

const handleCreatePostFormSubmit = (event) => {
    event.preventDefault();

    const data = new FormData(event.target);

    const postDto = {
        title: data.get("title"),
        body: data.get("content"),
        attachments: null
    };

    postService.createPost(postDto);
    closeModal();
    window.location.reload();
}