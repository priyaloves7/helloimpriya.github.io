import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore, doc, getDoc, updateDoc, increment,
  collection, query, where, onSnapshot, addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB9QD1WYW-aStDNfGeeigdeM-YcIOaUMo0",
  authDomain: "priya-s-blog.firebaseapp.com",
  projectId: "priya-s-blog",
  storageBucket: "priya-s-blog.firebasestorage.app",
  messagingSenderId: "156553954536",
  appId: "1:156553954536:web:3c93b80f97006b7bb8755d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ---------------------
// Get slug from URL
// ---------------------
const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get("slug");

// DOM
const titleEl = document.querySelector(".blog-post-title");
const dateEl = document.querySelector(".blog-post-date");
const imageEl = document.querySelector(".blog-post-image");
const contentEl = document.querySelector(".blog-post-content");
const likesEl = document.querySelector(".likes-count");
const commentsList = document.querySelector(".comments-list");

// ---------------------
// Load blog post
// ---------------------
async function loadPost() {
  const postRef = doc(db, "posts", slug);
  const snapshot = await getDoc(postRef);

  if (!snapshot.exists()) {
    titleEl.textContent = "Post not found 😭";
    return;
  }

  const post = snapshot.data();

  titleEl.textContent = post.title;
  dateEl.textContent = new Date(post.date.seconds * 1000).toDateString();
  imageEl.src = post.imageURL;
  contentEl.textContent = post.content;
  likesEl.textContent = `❤️ ${post.likes} likes`;
}

loadPost();

// ---------------------
// Load comments
// ---------------------
const commentsRef = collection(db, "comments");
const commentsQuery = query(commentsRef, where("postSlug", "==", slug));

onSnapshot(commentsQuery, (snapshot) => {
  commentsList.innerHTML = "";

  snapshot.forEach((d) => {
    const c = d.data();
    const div = document.createElement("div");
    div.classList.add("comment-item");

    div.innerHTML = `
      <strong>${c.userName}</strong>
      <p>${c.commentText}</p>
    `;

    commentsList.appendChild(div);
  });
});

// ---------------------
// Add comment
// ---------------------
document.getElementById("submitComment").addEventListener("click", async () => {
  const name = document.getElementById("username").value;
  const text = document.getElementById("commentText").value;

  if (!name || !text) return;

  await addDoc(commentsRef, {
    postSlug: slug,
    userName: name,
    commentText: text,
    createdAt: new Date()
  });

  document.getElementById("username").value = "";
  document.getElementById("commentText").value = "";
});
