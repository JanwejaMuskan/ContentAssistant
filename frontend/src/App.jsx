import { useState } from "react";
import "./App.css";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: "org-FXR9GaVklzHzMSzGxMfLvvEh",
  apiKey: "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",
});
configuration.baseOptions.headers = {
  Authorization: "Bearer " + "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",
};
const openai = new OpenAIApi(configuration);

function App() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [initialSystemMessageSent, setInitialSystemMessageSent] = useState(false);
  const [state, setState] = useState({
    counter: 0,
    practiceOption: "choose_path",
  });

  const handleUserMessage = async (userInput) => {
  
    const userMessage = { role: "user", content: userInput };
    setChats((prevChats) => [...prevChats, userMessage]);
  
    const systemMessage = getSystemMessage();
  
    if (!initialSystemMessageSent) {
      // Add the system message to chats only for the first time
      setChats((prevChats) => [...prevChats, { role: "system", content: systemMessage }]);
      setInitialSystemMessageSent(true);
      setState({ ...state, practiceOption: "user_choice" });
    }
    if (state.practiceOption === "user_choice") {
      if (userInput === "1" || userInput === "caption") {
        setState({ ...state, practiceOption: "captions" });
        const response = "Great!! I will respond you with the best caption. Let me know the description";
        setChats((prevChats) => [...prevChats, { role: "assistant", content: response }]);
        setIsTyping(false);
        return;
      } else if(userInput === "2" || userInput === "tags"){
        setState({ ...state, practiceOption: "tags" });
        const response = "Great!! I will respond you with the best tags. Let me know the description";
        setChats((prevChats) => [...prevChats, { role: "assistant", content: response }]);
        setIsTyping(false);
        return;
      } else if(userInput === "3" || userInput === "blog"){
        setState({ ...state, practiceOption: "blogs" });
        const response = "Great!! I will respond you with the best content for blog. Let me know the description";
        setChats((prevChats) => [...prevChats, { role: "assistant", content: response }]);
        setIsTyping(false);
        return;
      }else{
        const invalidChoiceResponse = "Invalid choice. Please select a valid option (1, 2, or 3).";
        setChats((prevChats) => [...prevChats, { role: "assistant", content: invalidChoiceResponse }]);
      }
    }

    if(state.practiceOption === "captions" || state.practiceOption === "tags" || state.practiceOption === "blogs"){
      setIsTyping(true);
      const system_msg = "You are a content assistant.Provide the caption for:"
      const response = await callOpenAI(system_msg+userInput);
      setChats((prevChats) => [...prevChats, response]);
    }
  
    setIsTyping(false);
  };
  

  const getSystemMessage = (userInput) => {
    if (state.practiceOption === "choose_path") {
      return "Choose option 1. Caption 2.Tags 3.Blogs";
    } else if (state.practiceOption === "captions") {
      return "Choose option 1. Caption 2.Tags 3.Blogs";
    } else if (state.practiceOption === "tags") {
      return "Choose option 1. Caption 2.Tags 3.Blogs";
    } else if(state.practiceOption === "blogs") {
      return "Choose option 1. Caption 2.Tags 3.Blogs";
    }
  };


  const callOpenAI = async (input) => {
    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: getSystemMessage() },
          ...chats,
          { role: "user", content: input },
        ],
      });
      return response.data.choices[0].message;
    } catch (error) {
      console.error(error);
      return "An error occurred while processing your request.";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message) return;
    handleUserMessage(message);
    setMessage("");
  };

  return (
    <main>
      <h1>Chat AI Tutorial</h1>

      <section>
        {chats && chats.length
          ? chats.map((chat, index) => (
            <p key={index} className={chat.role === "user" ? "user_msg" : ""}>
              {chat.role === "system" ? (
                <span>{chat.content}</span>
              ) : (
                <>
                  {chat.role === "assistant"}
                  {chat.content}
                </>
              )}
            </p>
          ))
          : ""}
      </section>


      <div className={isTyping ? "" : "hide"}>
        <p>
          <i>{isTyping ? "Typing" : ""}</i>
        </p>
      </div>

      <form action="" onSubmit={handleSubmit}>
        <input
          type="text"
          name="message"
          value={message}
          placeholder="Type a message here and hit Enter..."
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </main>
  );
}

export default App;
