class Post {
    static id = 0;
    pubDate;
    title;
    body;
    attachments;

    constructor(title, body, attachments) {
        this.id = ++Post.id;
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
    posts = JSON.parse(localStorage.getItem("posts")) || [];

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
            const newPost = new Post(postDto.title, postDto.body, postDto.attachments);
            this.posts.push(newPost);
            localStorage.setItem("posts", JSON.stringify(this.posts));
            console.log("Post created successfully.\n", newPost);
        }
    }
}

const postService = new PostService();

//! test code

// change variable to false to disable test data
const TESTING = true;
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

document.addEventListener("DOMContentLoaded", () => {
    if (postService.posts.length === 0) {
        let noPostsDiv = document.getElementById("noPosts");
        noPostsDiv.innerHTML = `<div class="icon">ⓘ</div>
                        <p><strong>Sem publicações</strong></p>`;
        noPostsDiv.setAttribute("class", "noPosts");
    } else {
        const divPosts = document.getElementById("posts");
        for (let p of postService.posts) {

            let postDiv = document.createElement("div");
            postDiv.setAttribute("class", "post");
            postDiv.innerHTML = `<h1>${p.title}</h1>
                                <div class="caixa">imagem </div>
                                <div class="conteudo">
                                    <p>${p.body}</p>
                                </div>`;
            divPosts.appendChild(postDiv);
        }
    }
});