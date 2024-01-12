import { useEffect, useState } from "react";
import "./App.scss";
import { Comment, CommentBox } from "./Component";
import dt from "./data.json";

function App() {
  const [state, setState] = useState({ data: dt.data, sortType: "asc" });

  useEffect(() => {
    new Promise((resolve, reject) => getCacheData(resolve));
  }, []);

  const updateCacheData = (data) => {
    if (caches) {
      caches.open("comment-data").then((cache) => {
        cache.match("comment-line").then((cachedResponse) => {
          cache?.put("comment-line", new Response(JSON.stringify(data)));
        });
      });
    }
  };

  const getCacheData = (resolve) => {
    if (!caches) {
      setState({
        ...state,
        data: sort("asc", dt.data),
      });
    } else {
      caches.open("comment-data").then((cache) => {
        cache.match("comment-line").then((cachedResponse) => {
          if (!cachedResponse) {
            cache?.put("comment-line", new Response(JSON.stringify(dt.data)));
            setState({
              ...state,
              data: sort("asc", dt.data),
            });
          } else {
            (async () => {
              let json = await cachedResponse.json();
              resolve(handleResolve(json));
            })();
          }
        });
      });
    }
  };

  const handleResolve = (data) => {
    setState({
      ...state,
      data: sort("asc", data),
    });
  };

  const onSubmit = (data) => {
    const dt = state.data;

    dt.push(data);
    const sortedData = sort(state.sortType, dt);
    setState({
      ...state,
      data: sortedData,
    });
    updateCacheData(sortedData);
  };

  const onDelete = (dt) => {
    setState({
      ...state,
      data: dt,
    });
    updateCacheData(dt);
  };

  const sort = (type, data = []) => {
    data.sort((a, b) =>
      type === "asc" ? a.timestamp - b.timestamp : b.timestamp - a.timestamp
    );
    data.forEach((item) => {
      if (item.reply && item.reply.length > 0) {
        sort(type, item.reply);
      }
    });
    return data;
  };

  const onClickSort = () => {
    setState({
      ...state,
      sortType: state.sortType === "asc" ? "dsc" : "asc",
      data: sort(state.sortType === "asc" ? "dsc" : "asc", state.data),
    });
  };

  const onUpdate = (dt, timestamp, childTimeStamp) => {
    let tempData = [...state.data];
    if (childTimeStamp) {
      const index = tempData.findIndex((el) => el.timestamp === timestamp);
      tempData[index].reply = [
        ...tempData[index].reply.filter(
          (el) => el.timestamp !== childTimeStamp
        ),
        dt,
      ];
    } else {
      tempData = [...tempData.filter((el) => el.timestamp !== timestamp), dt];
    }
    const sortedData = sort(state.sortType, tempData);
    setState({
      ...state,
      data: sortedData,
    });
    updateCacheData(sortedData);
  };

  const onReply = (dt, timestamp) => {
    let data = [...state.data];
    const index = state.data.findIndex((el) => el.timestamp === timestamp);
    if (!data[index].reply) {
      data[index] = {
        ...data[index],
        reply: [],
      };
    }
    data[index].reply.push(dt);
    const sortedData = sort(state.sortType, data);
    setState({
      ...state,
      data: sortedData,
    });
    updateCacheData(sortedData);
  };

  return (
    <div className="container">
      <div className="inner-container">
        <CommentBox onSubmit={onSubmit} />
        <Comment
          data={state.data}
          onSort={onClickSort}
          sort={state.sortType}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onReply={onReply}
        />
      </div>
    </div>
  );
}

export default App;
