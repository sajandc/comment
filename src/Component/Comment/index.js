import React, { useEffect, useState } from "react";
import CommentBox from "../CommentBox";
import dt from "../../data.json";

export default function Comment() {
  const [state, setState] = useState({
    sort: "asc",
    data: dt?.data || [],
    currentTimeStamp: "",
    reply: false,
    edit: false,
  });

  const commentLineItem = (el, isReply) => {
    return (
      <>
        <div
          className={`comments ${isReply ? "reply" : ""}`}
          key={el.timestamp}>
          <div className="heading">
            <div className="name">{el.name}</div>
            <div className="timestamp">
              {new Date(el.timestamp).toDateString()}
            </div>
          </div>
          <div className="comment">{el.comment}</div>
          <div id={`edit-${el.timestamp}`} className="edit">
            Edit
          </div>
          {!isReply && (
            <div id={`reply-${el.timestamp}`} className="edit">
              Reply
            </div>
          )}
          <div id={`delete-${el.timestamp}`} className="delete">
            <span
              id={`delete-${el.timestamp}`}
              class="material-symbols-outlined">
              delete
            </span>
          </div>
        </div>
        {state.reply && state.currentTimeStamp === el.timestamp && !isReply && (
          <CommentBox reply />
        )}
        {el.reply?.length > 0 && el.reply.map((e) => commentLineItem(e, true))}
      </>
    );
  };

  useEffect(() => {
    setState({
      ...state,
      data: sort("asc", dt.data),
    });
  }, []);

  const sort = (type, data) => {
    return data.sort((a, b) => {
      if (a.timestamp < b.timestamp) {
        return type === "asc" ? -1 : 1;
      }
      if (a.timestamp > b.timestamp) {
        return type === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const onClickSort = () => {
    setState({
      ...state,
      sort: state.sort === "asc" ? "dsc" : "asc",
      data: sort(state.sort === "asc" ? "dsc" : "asc", state.data),
    });
  };

  const onClickElement = (event) => {
    const [type, id] = event.target?.id?.split("-");
    switch (type) {
      case "delete":
        const dt = [...state.data].filter((el) => el.timestamp !== +id);
        setState({
          ...state,
          data: dt,
          currentTimeStamp: +id,
        });
        break;
      case "edit":
        setState({
          ...state,
          currentTimeStamp: +id,
          reply: false,
          edit: true,
        });
        break;
      case "reply":
        setState({
          ...state,
          currentTimeStamp: +id,
          edit: false,
          reply: true,
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="comment-container">
      <div className="sort" onClick={onClickSort}>
        Sort by: Date and Time
        <span class="material-symbols-outlined">
          {state.sort === "asc" ? "south" : "north"}
        </span>
      </div>

      <div className="comments-inner-container" onClick={onClickElement}>
        {state?.data.map((el) =>
          state.edit && el.timestamp === state.currentTimeStamp ? (
            <CommentBox
              data={state.data.find(
                (el) => el.timestamp === state.currentTimeStamp
              )}
              edit
            />
          ) : (
            commentLineItem(el)
          )
        )}
      </div>
    </div>
  );
}
