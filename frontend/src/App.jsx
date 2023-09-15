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

  const [isFormOpen, setIsFormOpen] = useState(false); // State to track if the form is open

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const recognition = new window.webkitSpeechRecognition();
  recognition.continuous = true;

  recognition.onstart = () => {
    setIsListening(true);
  };

  recognition.onresult = (event) => {
    const result = event.results[event.results.length - 1];
    const text = result[0].transcript;
    setTranscript(text); // Transcript based on the recognition result
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
      console.log("If block 1");
      setState({ ...state, practiceOption: "user_choice" });
      setChats((prevChats) => [...prevChats, { role: "system", content: systemMessage }]);
      setInitialSystemMessageSent(true);
    }
    if (state.practiceOption === "user_choice") {
      if (userInput === "1" || userInput === "caption") {
        console.log("If block 2");
        setState({ ...state, practiceOption: "captions" });
        const response = "Great!! I will respond you with the best captions. Let me know the DESCRIPTION";
        setChats((prevChats) => [...prevChats, { role: "assistant", content: response }]);
        setIsTyping(false);
        return;
      } else if (userInput === "2" || userInput === "tags") {
        console.log("If block 3");
        setState({ ...state, practiceOption: "tags" });
        const response = "Awesome!! I will respond you with the best tags. Let me know the DESCRIPTION";
        setChats((prevChats) => [...prevChats, { role: "assistant", content: response }]);
        setIsTyping(false);
        return;
      } else if (userInput === "3" || userInput === "meme") {
        console.log("If block 3");
        setState({ ...state, practiceOption: "memes" });
        const response = "Wonderful!! I will respond you with the best memes. Let me know the DESCRIPTION";
        setChats((prevChats) => [...prevChats, { role: "assistant", content: response }]);
        setIsTyping(false);
        return;
      } else if (userInput === "4" || userInput === "blog") {
        console.log("If block 4");
        setState({ ...state, practiceOption: "blogs" });
        const response = "Wonderful!! I will respond you with the best content for blog. Let me know the DESCRIPTION";
        setChats((prevChats) => [...prevChats, { role: "assistant", content: response }]);
        setIsTyping(false);
        return;
      } else if (userInput === "5" || userInput === "content") {
        console.log("If block 3");
        setState({ ...state, practiceOption: "contents" });
        const response = "Awesome!! I will respond you with the best content. Let me know the DESCRIPTION";
        setChats((prevChats) => [...prevChats, { role: "assistant", content: response }]);
        setIsTyping(false);
        return;
      } else if (userInput === "6" || userInput === "next") {
        console.log("If block 5");
        setChats((prevChats) => [...prevChats, { role: "system", content: systemMessage }]);
        setInitialSystemMessageSent(false);
        return;
      }
      else {
        const invalidChoiceResponse = "Invalid choice. Please select a valid option (1, 2, or 3).";
        setChats((prevChats) => [...prevChats, { role: "assistant", content: invalidChoiceResponse }]);
      }
    }

    const next_sent = "Type next to move forward.";

    if (
      (state.practiceOption === "captions" ||
        state.practiceOption === "tags" ||
        state.practiceOption === "blogs" ||
        state.practiceOption === "memes" ||
        state.practiceOption === "contents") &&
      userInput !== "next"
    ) {
      console.log("If block 6");
      setIsTyping(true);
      const system_msg = "You are a social media assistant. Provide the 5 ${state.practiceOption} for:";
      const response = await callOpenAI(system_msg + userInput);
      const responseText = typeof response === 'object' ? response.content : response;
      console.log("ResponseText", responseText);
      console.log("Next sent", next_sent);
      const assistantMessage = {
        role: "assistant",
        content: responseText + next_sent, // Combine response and next_sent
      };

      setChats((prevChats) => [...prevChats, assistantMessage]);
    }


    setIsTyping(false);
  };


  const getSystemMessage = (userInput) => {
    console.log(userInput);
    if (state.practiceOption === "choose_path" || state.practiceOption === "captions" || state.practiceOption === "tags" ||
      state.practiceOption === "blogs" || state.practiceOption === "memes" ||
      state.practiceOption === "contents") {
      return "I am your Content Assistant Chatbot. Please choose your requirement from one of the options - 1. Caption 2. Tags 3. Meme 4. Blog 5. Content"
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
      if (response.status === 200 && response.data.choices.length > 0) {
        return response.data.choices[0].message;
      } else {
        console.error("OpenAI API response error:", response);
        return "An error occurred while processing your request.";
      }
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
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
      } else {
        console.error('Failed to send message to server.');
      }
    } catch (error) {
      console.error('Error sending message to server:', error);
    }
  };


  return (
    <main>
      <h1>BuzzWiz</h1>

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

      <form className="input-cont" action="" onSubmit={handleSubmit}>
        <input
          type="text"
          name="message"
          value={transcript || message}
          placeholder="Type a message here and hit Enter..."
          onChange={(e) => setMessage(e.target.value)}

        />
        <button type="button" onClick={handleMicClick}>
          <MicIcon />
        </button>

        <button onClick={toggleForm}>Share</button>
      </form>

      {/* Conditionally render the form */}
      {isFormOpen && (
        <div>
          <input
            type="text"
            id="webhookMessage"
            name="webhookMessage"
            value={webhookMessage}
            onChange={(e) => setWebhookMessage(e.target.value)}
            placeholder="Enter message for webhook"
          />
          <button className="send" onClick={sendMessageToServer}>Send Message</button>
        </div>
      )}
    </main>
  );


}

export default App;