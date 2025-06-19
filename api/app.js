const post_url = "http://crud.tlol.me/wonbeom/post";
let pagePointer = 0;
let currentPostId = null;
let currentPage = 1;
const pageSize = 5;
//post데이터를 받아서 modal에 내용을 추가하고 show클래스를 추가해 화면에 띄우는 함수
const showModal = (post) => {
  currentPostId = post.id;
  document.querySelector("#modal-title").innerText = post.title;
  document.querySelector("#modal-content").innerText = post.content;
  document.querySelector("#post-modal").classList.add("show");
}; 
//포스트 모달이 발생하면 보이는걸 없애고 postid를 비게 만든다.
const hideModal = () => {
  document.querySelector("#post-modal").classList.remove("show");
  currentPostId = null;
}; 
// 페이지를 세는 변수와 페이지 형태로 만드는 변수를 넣어서 반복문을 통해서 여러 페이지를 만들고 페이지 넘어가는 버튼도 만들어서 클릭하면 넘어가게 한다
const renderPagination = (total) => {
  const pageCount = Math.ceil(total / pageSize);
  const pagination = document.querySelector("#pagination");
  pagination.innerHTML = "";
  for (let i = 1; i <= pageCount; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    btn.className = "page-btn";
    if (i === currentPage) btn.disabled = true;
    btn.addEventListener("click", () => {
      currentPage = i;
      loadPage();
    });
    pagination.appendChild(btn);
  }
};
//페이지 로딩 하는 함수
const loadPage = async () => {
  document.querySelector("#board").innerHTML = "";
  console.log(`Loading page ${currentPage}...`);
  const res = await fetch(
    `${post_url}?page=${currentPage}&pageSize=${pageSize}`
  );
  const result = await res.json();
  const posts = result.data || [];
  const total = result.total || 0;
  posts.forEach(createPost);
  renderPagination(total);
};
//포스트 리스트와 텍스트를 만드는 함수
const createPost = (post) => {
  const postLi = document.createElement("li");
  postLi.classList.add("post-container");
  document.querySelector("#board").appendChild(postLi);

  const postTitle = document.createElement("span");
  postTitle.innerText = post.title;
  postTitle.classList.add("bold-text");
  postLi.appendChild(postTitle);

  postLi.addEventListener("click", () => showModal(post));
};
//페이지에 더이상 추가할 수 없으면 새로운 공간을 만들어서 그 공간에 페이지 양식을 붙혀 새로운 페이지 만들기
const init = async () => {
  // 페이지네이션 영역 추가
  if (!document.querySelector("#pagination")) {
    const nav = document.createElement("div");
    nav.id = "pagination";
    // post-form의 부모에 pagination을 append
    const formModal = document.querySelector("#form-modal");
    if (formModal && formModal.parentNode) {
      formModal.parentNode.appendChild(nav);
    } else {
      document.body.appendChild(nav);
    }
  }
  loadPage();
};
//POST가 요청될때까지 기다렸다가 요청이 들어오면 post한다.
const write = async (data) => {
  const res = await fetch(post_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (res.ok) {
    currentPage = 1;
    await loadPage();
  }
};
//post수정이 아니라면 데이터를 적어서 제출한다. 수정이라면 게시글을 수정한다.
const submit = () => {
  const title = document.querySelector("#title").value;
  const content = document.querySelector("#content").value;
  const data = {
    title: title,
    content: content,
  };

  if (currentPostId) {
    editPost(data);
  } else {
    write(data);
  }

  // 폼 초기화
  document.querySelector("#title").value = "";
  document.querySelector("#content").value = "";
  currentPostId = null;
};
//삭제하는거
const deletePost = async () => {
  console.log("Deleting post with ID:", currentPostId);
  if (!currentPostId) return;

  const res = await fetch(`${post_url}/${currentPostId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    hideModal();
    location.reload();
  }
};
//수정하는거
const editPost = async (data) => {
  if (!currentPostId) return;

  const res = await fetch(`${post_url}/${currentPostId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    hideModal();
    location.reload();
  }
};
// 폼 모델을 보여줘서 수정 글쓰기 선택창을 만든다.
const showFormModal = (title = "", content = "") => {
  document.querySelector("#title").value = title;
  document.querySelector("#content").value = content;
  document.querySelector("#form-modal").classList.add("show");
  document.querySelector("#form-modal-title").innerText = currentPostId
    ? "수정"
    : "글쓰기";
};

const hideFormModal = () => {
  document.querySelector("#form-modal").classList.remove("show");
  document.querySelector("#title").value = "";
  document.querySelector("#content").value = "";
};

document.querySelector("#toggle-write").addEventListener("click", () => {
  currentPostId = null;
  showFormModal();
});

// 모달 버튼 이벤트 연결 (class 기반)
document
  .querySelectorAll(".modal-close")
  .forEach((btn) => btn.addEventListener("click", hideModal));
document
  .querySelectorAll(".modal-delete")
  .forEach((btn) => btn.addEventListener("click", deletePost));
document.querySelectorAll(".modal-edit").forEach((btn) =>
  btn.addEventListener("click", () => {
    const title = document.querySelector("#modal-title").innerText;
    const content = document.querySelector("#modal-content").innerText;
    showFormModal(title, content);
    hideModal();
  })
);
document.querySelectorAll(".form-cancel").forEach((btn) =>
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    hideFormModal();
    currentPostId = null;
  })
);

document.querySelector("#post-form").addEventListener("submit", (e) => {
  e.preventDefault();
  submit();
  hideFormModal();
});

// 모달 배경 클릭 시 닫기 (단일게시글)
document.querySelector("#post-modal").addEventListener("mousedown", (e) => {
  if (e.target === e.currentTarget) hideModal();
});
// 모달 배경 클릭 시 닫기 (글쓰기/수정)
document.querySelector("#form-modal").addEventListener("mousedown", (e) => {
  if (e.target === e.currentTarget) hideFormModal();
});

init();
