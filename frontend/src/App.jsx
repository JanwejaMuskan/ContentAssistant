import { useState } from "react";
import "./App.css";
import { Configuration, OpenAIApi } from "openai";
import MicIcon from '@mui/icons-material/Mic';


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
  const [transcript, setTranscript] = useState("");
  const [webhookMessage, setWebhookMessage] = useState("");
  const [isListening, setIsListening] = useState(false);

  const recognition = new window.webkitSpeechRecognition();
  recognition.continuous = true;

  // Define event handlers for recognition
  recognition.onstart = () => {
    setIsListening(true);
  };

  recognition.onresult = (event) => {
    const result = event.results[event.results.length - 1];
    const text = result[0].transcript;
    setTranscript(text); // Set the transcript based on the recognition result
    console.log("Transcript:", text);
  };

  recognition.onend = () => {
    setIsListening(false);
  };
  const handleUserMessage = async (userInput) => {

    const userMessage = { role: "user", content: userInput };
    setChats((prevChats) => [...prevChats, userMessage]);

    const systemMessage = getSystemMessage();

    if (userInput === "next" || !initialSystemMessageSent) {
      // Add the system message to chats only for the first time
      console.log("If block 1");
      setState({ ...state, practiceOption: "user_choice" });
      setChats((prevChats) => [...prevChats, { role: "system", content: systemMessage }]);
      setInitialSystemMessageSent(true);
    }
    if (state.practiceOption === "user_choice") {
      if (userInput === "1" || userInput === "caption") {
        console.log("If block 2");
        setState({ ...state, practiceOption: "captions" });
        const response = "Great!! I will respond you with the best caption. Let me know the description";
        setChats((prevChats) => [...prevChats, { role: "assistant", content: response }]);
        setIsTyping(false);
        return;
      } else if (userInput === "2" || userInput === "tags") {
        console.log("If block 3");
        setState({ ...state, practiceOption: "tags" });
        const response = "Great!! I will respond you with the best tags. Let me know the description";
        setChats((prevChats) => [...prevChats, { role: "assistant", content: response }]);
        setIsTyping(false);
        return;
      } else if (userInput === "3" || userInput === "blog") {
        console.log("If block 4");
        setState({ ...state, practiceOption: "blogs" });
        const response = "Great!! I will respond you with the best content for blog. Let me know the description";
        setChats((prevChats) => [...prevChats, { role: "assistant", content: response }]);
        setIsTyping(false);
        return;
      } else if (userInput === "4" || userInput === "next") {
        // setState({ ...state, practiceOption: "user_choice" });
        console.log("If block 5");
        setChats((prevChats) => [...prevChats, { role: "system", content: systemMessage }]);
        setInitialSystemMessageSent(false);
        return;
      }
      else if (userInput == "5" || userInput === "repeat") {
        handleUserMessage();
        return;
      }
      else {
        const invalidChoiceResponse = "Invalid choice. Please select a valid option (1, 2, or 3).";
        setChats((prevChats) => [...prevChats, { role: "assistant", content: invalidChoiceResponse }]);
      }
    }


    if ((state.practiceOption === "captions" || state.practiceOption === "tags" || state.practiceOption === "blogs") && userInput != "next") {
      console.log("If block 6");
      setIsTyping(true);
      const system_msg = "You are a content assistant.Provide the caption for:"
      const response = await callOpenAI(system_msg + userInput);
      setChats((prevChats) => [...prevChats, response]);
    }

    setIsTyping(false);
  };


  const getSystemMessage = (userInput) => {
    console.log(userInput);
    if (state.practiceOption === "choose_path") {
      return "Choose option 1. Caption 2.Tags 3.Blogs";
    } else if (state.practiceOption === "captions") {
      return "Choose option 1. Caption 2.Tags 3.Blogs";
    } else if (state.practiceOption === "tags") {
      return "Choose option 1. Caption 2.Tags 3.Blogs";
    } else if (state.practiceOption === "blogs") {
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

  const handleMicClick = async () => {
    try {
      if (!isListening) {
        // Start speech recognition
        recognition.start();
      } else {
        // Stop speech recognition
        recognition.stop();
        setIsListening(false);
      }
    } catch (error) {
      console.error("Error starting/stopping speech recognition:", error);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (transcript) { // Check if there's a transcript
      handleUserMessage(transcript); // Send the transcript as a message
      setTranscript("");
    } else if (message) { // If no transcript, send the message
      handleUserMessage(message);
    }
    setMessage(""); // Clear the input field
  };
  const sendMessageToServer = async () => {
    try {
      const response = await fetch('http://localhost:3000/forward-to-slack', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: webhookMessage }), // Send the webhookMessage
      });

      if (response.ok) {
        console.log('Message sent successfully to server.');
        // You can add logic here to handle success, e.g., show a success message to the user.
      } else {
        console.error('Failed to send message to server.');
        // You can add logic here to handle failures, e.g., show an error message to the user.
      }
    } catch (error) {
      console.error('Error sending message to server:', error);
      // You can add logic here to handle errors, e.g., show an error message to the user.
    }
  };


  return (
    <main>
      <h1>Chat Bot</h1>

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
          value={transcript || message}
          placeholder="Type a message here and hit Enter..."
          onChange={(e) => setMessage(e.target.value)}

        />
        <button type="button" onClick={handleMicClick}>
          <MicIcon/>
        </button>

      </form>
      <div>
        <input
          type="text"
          id="webhookMessage"
          name="webhookMessage"
          value={webhookMessage}
          onChange={(e) => setWebhookMessage(e.target.value)} // Update webhookMessage
          placeholder="Enter message for webhook"
        />
        <button onClick={sendMessageToServer}>Send Message to Server</button>
      </div>
    </main>
  );


}

export default App;