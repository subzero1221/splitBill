import { useState } from "react";
import "./index.css";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [selected, setSelected] = useState(0);
  const [friends, setFriends] = useState(initialFriends);

  function onSplitBill(value) {
    console.log(value);
    console.log(selected.id);
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selected.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelected(0);
  }

  return (
    <div className="app">
      <FriendList
        friends={friends}
        setFriends={setFriends}
        selected={selected}
        setSelected={setSelected}
      />

      <FormSplitBill
        onSplitBill={onSplitBill}
        friends={friends}
        selected={selected}
        setSelected={setSelected}
      ></FormSplitBill>
    </div>
  );
}

function FriendList({ friends, setFriends, setSelected, selected }) {
  const [isOpen, setIsOpen] = useState(false);
  function controlFriendForm() {
    setIsOpen((o) => !o);
  }

  return (
    <div className="sidebar">
      <ul>
        <>
          {friends.map((friend, i) => (
            <Friend key={friend.id}>
              <li
                className={
                  selected.id ? friend.id === selected.id && "selected" : ""
                }
              >
                <h3>{friend.name}</h3>
                <img src={friend.image} alt="friend.name"></img>
                <>
                  {friend.balance === 0 ? (
                    <p>
                      {friend.balance === 0 &&
                        `you and ${friend.name} are even`}
                    </p>
                  ) : (
                    <p className={friend.balance > 0 ? "green" : "red"}>
                      {friend.balance > 0
                        ? `${friend.name} owes you ${friend.balance}$`
                        : `you owe ${friend.name} ${Math.abs(friend.balance)}$`}
                    </p>
                  )}
                </>
                <button
                  className="button"
                  id={i}
                  onClick={(e) =>
                    setSelected((f) => (f = friends[e.target.id]))
                  }
                >
                  select
                </button>
              </li>
            </Friend>
          ))}
        </>
      </ul>
      <FriendButt isOpen={isOpen} controlFriendForm={controlFriendForm}>
        {!isOpen && (
          <button className="button" onClick={controlFriendForm}>
            Add friend{" "}
          </button>
        )}
      </FriendButt>
      <FriendButt isOpen={isOpen} controlFriendForm={controlFriendForm}>
        {isOpen && (
          <button className="button" onClick={controlFriendForm}>
            Close
          </button>
        )}
      </FriendButt>
      <FormAddFriend
        isOpen={isOpen}
        friends={friends}
        setFriends={setFriends}
      ></FormAddFriend>
    </div>
  );
}

function Friend({ children }) {
  return <div>{children}</div>;
}

function FriendButt({ children, isOpen, controlFriendForm }) {
  return <div>{children}</div>;
}

function FormAddFriend({ isOpen, setFriends, friends }) {
  const newId = Date.now();
  const [name, setNewName] = useState("");
  const [image, setNewimage] = useState("");

  function myFriend(e) {
    e.preventDefault();
    if (!name || !image) return;
    const friend = { id: newId, name, image: `${image}${newId}`, balance: 0 };
    setFriends((friends) => [...friends, friend]);

    console.log(friend);
    setNewName("");
    setNewimage("");
  }

  return (
    isOpen && (
      <form onSubmit={(e) => myFriend(e)}>
        <label>🤵 Friend name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setNewName((name) => (name = e.target.value))}
        ></input>

        <label>🖼image URL</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setNewimage((image) => (image = e.target.value))}
        ></input>
        <button className="button">Add</button>
      </form>
    )
  );
}

function FormSplitBill({ selected, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [myMoney, setMyMoney] = useState("");
  const [me, setMe] = useState("user");

  if (!selected) return;

  function handleSplit(e) {
    e.preventDefault();
    if (!bill || !myMoney) return;

    onSplitBill(me === "user" ? bill - myMoney : -myMoney);
  }

  return (
    <div>
      <form className="form-split-bill" onSubmit={(e) => handleSplit(e)}>
        <h2>Split a bill with {selected.name}</h2>
        <label>💰 Bill value</label>
        <input
          type="text"
          value={bill}
          onChange={(e) => setBill((b) => (b = +e.target.value))}
        ></input>
        <label>👦 Your expense</label>
        <input
          type="text"
          value={myMoney}
          onChange={(e) => setMyMoney((m) => (m = +e.target.value))}
        ></input>
        <label>👫 {selected.name}'s expense</label>
        <input
          type="text"
          disabled
          value={bill - myMoney > 0 ? bill - myMoney : 0}
        ></input>
        <label>💩 Whos is paying the bill</label>
        <select value={me} onChange={(e) => setMe((m) => (m = e.target.value))}>
          <option value="user">You</option>
          <option value="friend">{selected.name}</option>
        </select>
        <button className="button">Split bill</button>
      </form>
    </div>
  );
}
