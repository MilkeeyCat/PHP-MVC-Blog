import {Slider, transitionDuration} from "./slider.js";
import {animateAlert} from "./functions.js";

const CREATE_COMMENTS = 1;
const ADD_COMMENTS = 2;

let data;

window.onload = () => {

    const articleId = window.location.pathname.match(/\/(?<articleId>[0-9]+)/).groups.articleId;

    function listReplies(commentId, data, list) {
        for (let i = 0; i < data.length; ++i) {
            if (data[i]["reply_to"] == commentId) {
                let comment = `
                <div class="comments__item" data-id="${data[i].id}">
                    <hr>
                    <div class="comments__comment">
                        <div class="comments__avatar" style="background-image:url(${data[i].avatar});"></div>
                        <div class="comments__text">
                            <div class="comments__top">
                                <div class="comments__author-data">
                                    <p class="comments__name">${data[i].name}</p>
                                    <p class="comments__pub-date">${data[i]["pub_date"]}</p>
                                </div>
                                <div class="comments__reply">
                                    <i class="fa fa-reply" aria-hidden></i>
                                    REPLY
                                </div>
                            </div>
                            <p class="comments__comment-text">${data[i].text}</p>
                        </div>
                    </div>
                    <hr>
                    <div class="comments__reply-comment"></div>
                </div>
                `;
                list.insertAdjacentHTML("beforeend", comment);
                listReplies(data[i].id, data, list.querySelector(`.comments__item[data-id="${data[i].id}"] > .comments__reply-comment`));
            }
        }
    }

    let replyBtns;

    async function loadMoreComments(insertionLocation) {
        // debugger;
        if (data?.next) {
            listComment(data.next, ADD_COMMENTS);
        } else {
            const parent = insertionLocation.parentNode;
            parent.removeChild(parent.querySelector("button"));

            return false;
        }
    }

    async function listComment(url, action = CREATE_COMMENTS) {

        data = await fetch(url)
            .then(res => res.json());

        let res;

        if (action === CREATE_COMMENTS) {
            res = document.createElement("div");
            res.classList.add("comments__inner");
        } else if (action === ADD_COMMENTS) {
            res = document.querySelector(".comments__inner");
        }

        for (let i = 0; i < data.comments.length; ++i) {
            let comment = data.comments[i];
            if (comment["reply_to"] == null) {
                let commentHTML = `
                    <div class="comments__item" data-id="${comment.id}">
                        <hr>
                        <div class="comments__comment">
                            <div class="comments__avatar" style="background-image:url(${comment.avatar});"></div>
                            <div class="comments__text">
                                <div class="comments__top">
                                    <div class="comments__author-data">
                                        <p class="comments__name">${comment.name}</p>
                                        <p class="comments__pub-date">${comment["pub_date"]}</p>
                                    </div>
                                    <div class="comments__reply">
                                        <i class="fa fa-reply" aria-hidden></i>
                                            REPLY
                                    </div>
                                </div>
                                <p class="comments__comment-text">${comment.text}</p>
                            </div>
                        </div>
                        <hr>
                        <div class="comments__reply-comment"></div>
                    </div>
                `;

                res.insertAdjacentHTML("beforeend", commentHTML);
                listReplies(comment.id, data.comments, res.querySelector(`.comments__item[data-id="${comment.id}"] > .comments__reply-comment`));
            }
        }

        const insertionPos = document.querySelector(".comments");
        insertionPos.insertBefore(res, insertionPos.children[1]);

        document.querySelector(".comments .section__title").textContent = `${document.querySelectorAll(".comments__item").length} COMMENTS`;

        replyBtns = document.querySelectorAll(".comments__reply");

        setHandlerToReplyBtns();

        if (data?.next && !res.parentNode.querySelector("button")) {
            res.insertAdjacentHTML("afterend", `
                <button>Load more comments</button>
            `);
            res.parentNode.querySelector("button").onclick = function () {
                loadMoreComments(res);
            }
        } else if (data?.next) {
            return true;
        } else {
            let parent = res.parentNode;
            parent.removeChild(parent.querySelector("button"));
        }

        // document.querySelector(".comments .section__title").textContent = `${document.querySelectorAll(".comments__item").length} COMMENTS`;
        //
        // replyBtns = document.querySelectorAll(".comments__reply");
        // setHandlerToReplyBtns();

    }

    listComment("/comments-list/" + articleId);

    const slider = new Slider({
        slider: ".article__slider",
        transitionDuration,
        defaultTranslateX: "-100%",
        maxTranslateX: "-200%"
    });

    let selectedBtn;

    function setHandlerToReplyBtns() {
        replyBtns.forEach(function (el, currentId) {
            el.onclick = function () {
                replyBtns.forEach((btn, btnId) => {
                    if (btnId !== currentId) {
                        btn.classList.remove("comments__reply_selected");
                    }
                });
                this.classList.toggle("comments__reply_selected");
                selectedBtn = Array.from(replyBtns).filter(el => el.classList.contains("comments__reply_selected"))[0]?.closest(".comments__item");
            }
        });
    }

    slider.run();

    const commentForm = document.querySelector(".leave-comments form");

    commentForm.onsubmit = async function (e) {
        e.preventDefault();

        const errors = [];

        const data = {
            "name": this.querySelector(".leave-comments__row > input:first-child").value,
            "email": this.querySelector(".leave-comments__row > input:last-child").value,
            "comment": this.querySelector("textarea").value,
            "replyTo": selectedBtn?.dataset.id || "NULL"
        };

        if (data.name.trim() == "") {
            errors.push("Please enter your name");
        }
        if (data.email.trim() == "") {
            errors.push("Please enter your email address");
        }
        if (!/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(data.email)) {
            errors.push("Please enter correct email address!");
        }
        if (data.comment.trim() == "") {
            errors.push("Please enter your comment");
        }

        if (errors.length !== 0) {
            animateAlert("error", errors[0]);
            throw new Error("Не пройдешь");
        }

        const result = await fetch("/leave-comment", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(data)
        }).then(res => res.json());

        if (result.status == 200) {
            const comments = document.querySelector(".comments__inner");

            let placeToInsert = document.querySelector(`.comments__item[data-id="${result.comment["reply_to"]}"]`);

            placeToInsert = placeToInsert === null ? comments : placeToInsert.querySelector(".comments__reply-comment");

            const comment = result.comment;

            placeToInsert.insertAdjacentHTML("afterbegin", `
                <div class="comments__item" data-id="${comment.id}">
                    <div class="comments__comment">
                        <div class="comments__avatar" style="background-image:url(${comment.avatar});"></div>
                        <div class="comments__text">
                            <div class="comments__top">
                                <div class="comments__author-data">
                                    <p class="comments__name">${comment.name}</p>
                                    <p class="comments__pub-date">${comment["pub_date"]}</p>
                                </div>
                                <div class="comments__reply">
                                    <i class="fa fa-reply" aria-hidden></i>
                                        REPLY
                                </div>
                            </div>
                            <p class="comments__comment-text">${comment.text}</p>
                        </div>
                    </div>
                    <div class="comments__reply-comment"></div>
                </div>
            `);

            document.querySelector(".comments .section__title").textContent = `${document.querySelectorAll(".comments__item").length} COMMENTS`;

            replyBtns = document.querySelectorAll(".comments__reply");

            setHandlerToReplyBtns();

            animateAlert("success", "Comment added successfully");
            this.reset();
            selectedBtn = null;
        } else {
            const error = result.message;
            animateAlert("error", error);
        }
    }
}