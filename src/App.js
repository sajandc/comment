import "./App.scss";
import { Comment, CommentBox } from "./Component";

function App() {
  return (
    <div className="container">
      <div className="inner-container">
        <CommentBox />
        <Comment />
      </div>
    </div>
  );
}

export default App;
