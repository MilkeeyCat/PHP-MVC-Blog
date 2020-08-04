import {Slider, transitionDuration} from "./slider.js";
import { animateAlert } from "./functions.js";

window.onload = () => {

    const articleId = window.location.pathname.match(/\/(?<articleId>[0-9]+)/).groups.articleId;

    function listReplies(commentId, data, list) {
        for (let i = 0; i < data.length; ++i) {
            if (data[i]["reply_to"] == commentId) {
                let comment = `
                <div class="comments__item" data-id="${data[i].id}">
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
                    <div class="comments__reply-comment"></div>
                </div>
                `;
                list.insertAdjacentHTML("beforeend", comment);
                listReplies(data[i].id, data, list.querySelector(`.comments__item[data-id="${data[i].id}"] > .comments__reply-comment`));
            }
        }
    }

    let replyBtns;

    async function listComment() {
        const data = await fetch("/comments-list/" + articleId)
            .then(res => res.json());

        const res = document.createElement("div");
        res.classList.add("comments__inner");

        for (let i = 0; i < data.length; ++i) {
            if (data[i]["reply_to"] == null) {
                let comment = `
                    <div class="comments__item" data-id="${data[i].id}">
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
                        <div class="comments__reply-comment"></div>
                    </div>
                `;

                res.insertAdjacentHTML("beforeend", comment);
                listReplies(data[i].id, data, res.querySelector(`.comments__item[data-id="${data[i].id}"] > .comments__reply-comment`));
            }
        }
        document.querySelector(".comments").appendChild(res);
        document.querySelector(".comments .section__title").textContent = `${data.length} COMMENTS`;

        replyBtns = document.querySelectorAll(".comments__reply");
        setHandlerToReplyBtns();
    }

    listComment();

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
            comments.parentNode.removeChild(comments);
            listComment();
            animateAlert("success", "Comment added successfully");
            this.reset();
            selectedBtn = null;
        } else {
            const error = result.message;
            animateAlert("error", error);
        }
    }
}