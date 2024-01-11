import React, { useState } from "react";

export default function CommentBox(props) {
  const [state, setState] = useState({ name: "", comment: "" });
  const onChange = (e) => {
    setState({
      ...state,
      [e.target.id]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
  };
  const { edit, data: { name, comment } = {}, reply } = props;
  return (
    <form onSubmit={onSubmit} className={`comment-box ${reply ? "reply" : ""}`}>
      {!edit && <div>Comment</div>}
      {!edit ? (
        <input
          id="name"
          required
          placeholder="Name"
          value={state.name}
          onChange={onChange}
        />
      ) : (
        <div className="name">{name}</div>
      )}
      <textarea
        id="comment"
        required
        placeholder="Comment"
        value={state.comment || comment}
        onChange={onChange}
      />
      <div>
        <button type="submit">POST</button>
      </div>
    </form>
  );
}
