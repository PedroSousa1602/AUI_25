class Post {
    static id = 0;
    pubDate;
    title;
    body;
    attachments;

    constructor(title, body, attachments) {
        ++this.id;
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
        let isTitleNull = String.IsNullOrEmpty(postDto.title);
        let isBodyNull = String.IsNullOrEmpty(postDto.body);

        if (isTitleNull && isBodyNull) {
            console.log("Post's title and body cannot be empty.");
        }
        else if (isTitleNull) {
            console.log("Post title cannot be empty.");
        }
        else if (isBodyNull) {
            console.log("Post body cannot be empty.");
        }
        return !(isTitleNull || isBodyNull);
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

document.addEventListener("DOMContentLoaded", () => {
    if (postService.posts.length == 0) {
        let noPostsDiv = document.getElementsByClassName("noPosts")[0];
        noPostsDiv.setAttribute("style", "display: flex;");
    } else {
        // todo: render posts
    }
});

