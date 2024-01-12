export default function CommentLine({ data, isReply, parentId = "" }) {
  return (
    <div className={`comments ${isReply ? "reply" : ""}`} key={data.timestamp}>
      <div className="heading">
        <div className="name">
          <span className="material-symbols-outlined font-20 mr-10">
            person
          </span>
          {data.name}
        </div>
        <div className="timestamp">
          <span class="material-symbols-outlined font-16 mr-10">schedule</span>
          {new Date(data.timestamp).toDateString()}
        </div>
      </div>
      <div className="comment">
        {" "}
        <span className="material-symbols-outlined font-16 mr-10">chat</span>
        {data.comment}
      </div>
      <div id={`edit-${data.timestamp}-${parentId}`} className="edit">
        Edit
        <span
          id={`edit-${data.timestamp}-${parentId}`}
          className="material-symbols-outlined font-16 ml-5">
          edit
        </span>
      </div>
      {!isReply && (
        <div id={`reply-${data.timestamp}`} className="edit">
          Reply
          <span
            id={`reply-${data.timestamp}`}
            className="material-symbols-outlined font-16 ml-5">
            reply
          </span>
        </div>
      )}
      <div id={`delete-${data.timestamp}-${parentId}`} className="delete">
        <span
          id={`delete-${data.timestamp}-${parentId}`}
          className="material-symbols-outlined font-16">
          delete
        </span>
      </div>
    </div>
  );
}
