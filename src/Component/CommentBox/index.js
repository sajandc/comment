import React, { useEffect, useState } from "react";

export default function CommentBox(props) {
  const [state, setState] = useState({ name: "", comment: "" });
  const { edit, data: { name = "", comment = "" } = {}, reply } = props;
  useEffect(() => {
    setState({ name, comment });
  }, []);
  const onChange = (e) => {
    setState({
      ...state,
      [e.target.id]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const dt = { ...state };
    props.onSubmit({ ...dt, timestamp: Date.now() });
    setTimeout(() => setState({ comment: "", name: "" }));
  };

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
        value={state.comment}
        onChange={onChange}
      />
      <div>
        <button type="submit">
          POST
          <span className="material-symbols-outlined font-20">send</span>
        </button>
      </div>
    </form>
  );
}
