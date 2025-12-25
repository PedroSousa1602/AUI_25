class Post {
    id;
    pubDate;
    title;
    body;
    lastEdited;
    attachments;

    constructor(id, title, body, attachments) {
        this.id = id;
        this.pubDate = new Date();
        this.title = title;
        this.body = body;
        this.lastEdited = null;
        this.attachments = attachments;
    }

    toString() {
        return `Post ID: ${this.id}\n
            Title: ${this.title}\n
            Body: ${this.body}\n
            Published on: ${this.pubDate}\n
            ${this.lastEdited ? `Last Edited: ${this.lastEdited}` : ''}\n
            ${this.attachments ? `Attachments: ${this.attachments}\n` : ''}`;
    }
}

class PostService {
    posts = JSON.parse(localStorage.getItem("posts-list")) || [];

    createPost(postDto) {
        if (!this.isPostDtoValid(postDto)) return;

        this.posts.length == 0 ? postDto.id = 1 : postDto.id = this.posts.at(-1).id + 1;
        const newPost = new Post(postDto.id, postDto.title, postDto.body, postDto.attachments);
        this.posts.push(newPost);
        localStorage.setItem("posts-list", JSON.stringify(this.posts));
        console.log("Post created successfully.\n", newPost);
    }

    deletePost(postDto) {
        this.posts = this.posts.filter(p => p.id != postDto.id);
        localStorage.setItem("posts-list", JSON.stringify(this.posts));
        console.log("Post deleted successfully.\n");
    }

    updatePost(postDto) {
        if (!this.isPostDtoValid(postDto)) return;

        let saved = this.posts.find(p => p.id == postDto.id);
        if (saved) {
            saved.title = postDto.title;
            saved.body = postDto.body;
            saved.attachments = postDto.attachments;
            saved.lastEdited = new Date();
            this.posts[postDto.id - 1] = saved;
            localStorage.setItem("posts-list", JSON.stringify(this.posts));
            console.log("Post edited successfully.\n", saved);
        } else {
            console.log("Post not found.\n");
        }
    }

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
}

const postService = new PostService();

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
    editBtn.onclick = () => handleEditPostBtn(post);

    const deleteBtn = document.createElement("button");
    deleteBtn.setAttribute("class", "delete-btn");
    deleteBtn.onclick = () => handleDeletePostBtn(post);

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

    // post footer
    // todo: style post-footer
    moment.locale('pt-br');
    const postFooterDiv = document.createElement("div");
    postFooterDiv.setAttribute("class", "post-footer");
    const pubDateSpan = document.createElement("span");
    pubDateSpan.textContent = `Publicado ${moment(post.pubDate).fromNow()}`;
    postFooterDiv.appendChild(pubDateSpan);

    if (post.lastEdited) {
        const lastEditedSpan = document.createElement("span");
        lastEditedSpan.textContent = `\nÚltima edição ${moment(post.lastEdited).fromNow()}`;
        postFooterDiv.appendChild(lastEditedSpan);
    }

    postDiv.appendChild(postFooterDiv);
};

const handleDeletePostBtn = (post) => {
    showModal("delete-post-modal");

    const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
    confirmDeleteBtn.onclick = () => {
        postService.deletePost(post);
        closeModal("delete-post-modal");
        window.location.reload();
    };
}

const handleCreatePostFormSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const postDto = {
        title: data.get("title"),
        body: data.get("content"),
        attachments: data.get("attachments") ? data.get("attachments") : null
    };

    postService.createPost(postDto);
    closeModal('create-post-modal');
    window.location.reload();
    return postDto;
}

const handleEditPostBtn = (post) => {
    showModal("edit-post-modal");
    const form = document.getElementById("post-edit-modal");
    form.id.value = post.id;
    form.title.value = post.title;
    form.content.value = post.body;
}

const handleEditPostFormSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const postDto = {
        id: parseInt(data.get("id")),
        title: data.get("title"),
        body: data.get("content"),
        attachments: data.get("attachments") ? data.get("attachments") : null
    };
    postService.updatePost(postDto);
    closeModal("edit-post-modal");
    window.location.reload();
}

const showModal = (modalId) => {
    const modal = document.getElementById(modalId);
    modal.classList.add("show-modal");
}

const closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    modal.classList.remove("show-modal");
}

window.addEventListener("click", e => (e.target.classList.contains("modal-container")) ? closeModal(e.target.id) : false);

// todo - fix: why isn't it working? 
window.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        const modals = document.getElementsByClassName("modal-container");
        for (let modal of modals) {
            if (modal.classList.contains("show-modal")) closeModal(modal.id);
        }
    }
});

(() => document.addEventListener("DOMContentLoaded", () => {
    if (postService.posts.length === 0) showNoPostsBox();
    else
        for (let post of postService.posts) renderPost(post);

}))();
