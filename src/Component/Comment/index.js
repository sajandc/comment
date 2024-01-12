import React, { useState } from "react";
import CommentBox from "../CommentBox";
import CommentLine from "./commentLine";

export default function Comment({
  data = [],
  onSort,
  sort,
  onDelete,
  onUpdate,
  onReply,
}) {
  const [state, setState] = useState({
    currentTimeStamp: "",
    reply: false,
    edit: false,
  });

  const onSubmitReply = (dt, timestamp) => {
    setState({ ...state, reply: false });
    onReply(dt, timestamp);
  };

  const commentLineItem = (el, isReply) => {
    return (
      <>
        <CommentLine key={el.timestamp} data={el} />
        {state.reply && state.currentTimeStamp === el.timestamp && !isReply && (
          <CommentBox
            reply
            onSubmit={(dt) => onSubmitReply(dt, el.timestamp)}
          />
        )}
        {el.reply?.length > 0 &&
          el.reply.map((e) =>
            state.edit && e.timestamp === state.currentTimeStamp ? (
              <CommentBox
                key={e.timestamp}
                data={e}
                edit
                reply
                onSubmit={(dt) => onUpdate(dt, el.timestamp, e.timestamp)}
              />
            ) : (
              <CommentLine
                key={e.timestamp}
                parentId={el.timestamp}
                data={e}
                isReply
              />
            )
          )}
      </>
    );
  };

  const onClickElement = (event) => {
    const [type, id, parentId] = event.target?.id?.split("-");
    switch (type) {
      case "delete":
        if (parentId) {
          let dt = [...data];
          const index = dt.findIndex((el) => el.timestamp === +parentId);
          dt[index].reply = dt[index].reply.filter(
            (el) => el.timestamp !== +id
          );
          onDelete(dt);
        } else {
          const dt = [...data].filter((el) => el.timestamp !== +id);
          onDelete(dt);
        }
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
      <div className="sort" onClick={onSort}>
        Sort by: Date and Time
        <span className="material-symbols-outlined">
          {sort === "asc" ? "south" : "north"}
        </span>
      </div>

      <div className="comments-inner-container" onClick={onClickElement}>
        {data.map((el) =>
          state.edit && el.timestamp === state.currentTimeStamp ? (
            <>
              <CommentBox
                key={el.timestamp}
                data={el}
                edit
                onSubmit={(dt) => onUpdate(dt, el.timestamp)}
              />
              {el.reply?.length > 0 &&
                el.reply.map((e) => (
                  <CommentLine key={e.timestamp} data={e} isReply />
                ))}
            </>
          ) : (
            commentLineItem(el)
          )
        )}
      </div>
    </div>
  );
}
